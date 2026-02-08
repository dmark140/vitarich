/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import ARegUser from './ARegUser'
import React from 'react'
import { useGlobalContext } from '@/lib/context/GlobalContext'

import { upsertUserProfile, getProfileByAuthId, insertUserProfile, updateUserProfile } from '../api'
import { User } from '@supabase/supabase-js'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { UserInsert, UserRow } from '@/lib/types'
import RuleAndPerm from './RuleAndPerm'
import SuperUser from './SuperUser'
import { ColumnsYesOrNoCodeOnly } from '@/lib/Defaults/DefaultColumns'
import { db } from '@/lib/Supabase/supabaseClient'
import { InputDropDown } from '@/components/ui/InputDropDown'
import { DefaultGenders } from '@/lib/Defaults/DefaultValues'

type authProps = {
  email: string;
  id: string;
  auth_id: string;
}

export default function Layout() {
  const [tab, setTab] = useState(1)
  const { getValue } = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  const [form, setForm] = useState<Partial<UserRow>>({})
  const [authSelected, setauthSelected] = useState<authProps | undefined>()

  const fields = [
    { tabIndex: 1, required: true, key: 'firstname', label: 'First Name' },
    { tabIndex: 2, required: false, key: 'middlename', label: 'Middle Name' },
    { tabIndex: 3, required: true, key: 'lastname', label: 'Last Name' },
    { tabIndex: 5, required: false, key: 'mobile', label: 'Mobile' },
    { tabIndex: 6, required: false, key: 'birthdate', label: 'Birthdate', type: 'date' },
    { tabIndex: 7, required: false, key: 'gender', label: 'Gender' },
    { tabIndex: 8, required: false, key: 'phone', label: 'Phone' },
    { tabIndex: 9, required: false, key: 'location', label: 'Address' },
    { tabIndex: 10, required: false, key: 'remarks', label: 'Remarks', component: 'textarea' },
  ]

  const handleTabChange = (e: number) => {
    if (e === tab) return
    setTab(e)
  }

  const handleChange = useCallback((key: keyof UserInsert, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!loggedInUser?.id) {
      toast.error("Administrator not authenticated. Cannot save profile.");
      return;
    }

    if (!authSelected?.id) {
      toast.error("No user selected for profile update.");
      return;
    }

    if (tab !== 1) {
      toast.warning("Go to 'Details' tab to save profile.");
      return;
    }
    setLoading(true)
    try {
      const dataToUpsert: UserInsert = {
        ...form,
        auth_id: authSelected.auth_id,
        created_by: loggedInUser.id,
      } as UserInsert

      await updateUserProfile(dataToUpsert)
      toast.success(`Profile for ${authSelected.email} saved successfully!`)
    } catch (error: any) {
      toast.error(error.message || 'Error saving profile.')
    } finally {
      setLoading(false)
    }
  }

  // Get logged-in user
  useEffect(() => {
    const getSessionUser = async () => {
      const { data: { session } } = await db.auth.getSession()
      setLoggedInUser(session?.user ?? null)
    }
    getSessionUser()
  }, [])

  // Load selected user
  useEffect(() => {
    const selected = getValue("selectedUser") as authProps;
    console.log({ selected })
    setauthSelected(selected);
  }, [getValue]);

  // Fetch selected user profile
  const fetchProfile = async () => {
    if (!authSelected?.id) {
      setForm({});
      setIsInitialLoading(false);
      return;
    }

    setIsInitialLoading(true);

    try {
      const existingProfile = await getProfileByAuthId(authSelected.auth_id)
      if (existingProfile) {
        setForm(existingProfile)
      } else {
        setForm({});
      }
    } catch {
      toast.error('Failed to load user profile.')
    } finally {
      setIsInitialLoading(false);
    }
  }

  useEffect(() => {


    fetchProfile()
  }, [authSelected])

  const isSaving = loading;
  const isDisabled = isSaving || isInitialLoading || tab !== 1 || !authSelected?.id;
  const saveButtonText = isInitialLoading
    ? 'Loading...'
    : isSaving
      ? 'Saving...'
      : 'Save';

  const handleAllowAll = () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      "#permissions-container .permission-checkbox"
    );

    let changed = 0;

    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        checkbox.click(); // 🔥 triggers toggleUserPermission()
        changed++;
      }
    });

    toast.success(
      changed > 0 ? `Enabled ${changed} permissions` : "All permissions already enabled"
    );
  };


  const handleRemoveAll = () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      "#permissions-container .permission-checkbox"
    );

    let changed = 0;

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.click(); // 🔥 triggers toggleUserPermission()
        changed++;
      }
    });

    toast.success(
      changed > 0
        ? `Disabled ${changed} permissions`
        : "All permissions already disabled"
    );
  };


  return (
    <div>


      <div className='px-4 my-2 flex justify-between'>
        <p className='font-bold text-xl'>
          {authSelected?.email || 'No User Selected'}
        </p>
        <div className='flex gap-2'>
          {tab === 2 && (
            <>
              <Button
                onClick={handleAllowAll}
                variant="secondary"
                disabled={isInitialLoading}
              >
                Allow All
              </Button>

              <Button
                onClick={handleRemoveAll}
                variant="destructive"
                disabled={isInitialLoading}
              >
                Remove All
              </Button>
            </>
          )}

          <Button disabled={isInitialLoading || !authSelected?.id} variant='secondary'>
            Change Password
          </Button>
          <Button onClick={() => handleSubmit()} disabled={isDisabled}>
            {saveButtonText}
          </Button>
        </div>
      </div>

      <Separator />

      <div className='px-4 flex items-center gap-2 my-2'>
        <Button
          onClick={() => handleTabChange(1)}
          variant={tab == 1 ? 'secondary' : 'ghost'}
          disabled={isInitialLoading}
        >
          Details
        </Button>

        <Button
          onClick={() => handleTabChange(2)}
          variant={tab == 2 ? 'secondary' : 'ghost'}
          disabled={isInitialLoading}
        >
          Roles & Permissions
        </Button>


      </div>

      <Separator />

      {tab === 1 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <SuperUser /> */}
          <div>
            <div className="md:grid md:grid-cols-3 gap-4 px-4">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className={`${field.component === 'textarea' ? 'col-span-3' : ''} mt-2 grid gap-2`}
                >
                  <Label required={field.required}>{field.label}</Label>

                  {field.key === "gender" ? (
                    <InputDropDown
                      data={DefaultGenders}
                      columns={ColumnsYesOrNoCodeOnly as any}
                      onClick={(e: { code: string }) =>
                        handleChange(
                          field.key as keyof UserInsert,
                          field.type === 'date'
                            ? new Date(e.code).toISOString()
                            : e.code
                        )
                      }
                    />
                  ) : field.component === 'textarea' ? (
                    <Textarea
                      value={(form[field.key as keyof UserInsert]) || ''}
                      onChange={(e) => handleChange(field.key as keyof UserInsert, e.target.value)}
                    />
                  ) : (
                    <Input
                      className='date-input'
                      tabIndex={field.tabIndex}
                      required={field.required}
                      type={field.type || 'text'}
                      value={
                        field.type === 'date'
                          ? form[field.key as keyof UserInsert]
                            ? (form[field.key as keyof UserInsert] as string).split('T')[0]
                            : ''
                          : (form[field.key as keyof UserInsert] as string) || ''
                      }
                      onChange={(e) =>
                        handleChange(
                          field.key as keyof UserInsert,
                          field.type === 'date'
                            ? new Date(e.target.value).toISOString()
                            : e.target.value
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {tab === 2 && !isInitialLoading && (
        <div className='px-4'>
          <RuleAndPerm userId={authSelected?.auth_id || '0'} />
        </div>
      )}

      {/* <Button onClick={fetchProfile}>fetchProfile</Button> */}
    </div>
  )
}

