/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import React, { useEffect, useState } from 'react'
import { upsertUserProfile } from '../api' // <-- Renamed import
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js'
import { db } from '@/lib/supabaseClient'
import { Label } from '@/components/ui/label'
import { InputDropDown } from '@/lib/InputDropDown'
import { DefaultGenders } from '@/lib/DefaultValues'
import { ColumnsYesOrNoCodeOnly } from '@/lib/DefaultColumns'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserInsert } from '@/lib/types'


export default function BUserDetailes() {
    const [user, setuser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState<Partial<UserInsert>>({})

    const fields: {
        key: keyof Omit<UserInsert, 'auth_id' | 'created_by' | 'updated_by' | 'created_at'>
        label: string
        type?: string
        component?: 'input' | 'textarea'
        required: boolean,
        tabIndex: number,

    }[] = [
            { tabIndex: 1, required: true, key: 'firstname', label: 'First Name' },
            { tabIndex: 2, required: false, key: 'middlename', label: 'Middle Name' },
            { tabIndex: 3, required: true, key: 'lastname', label: 'Last Name' },
            // Email is likely managed by the Auth user, but keeping it for completeness
            // { tabIndex: 4, required: true, key: 'email', label: 'Email', type: 'email' },
            { tabIndex: 5, required: true, key: 'mobile', label: 'Mobile' },
            { tabIndex: 6, required: false, key: 'birthdate', label: 'Birthdate', type: 'date' },
            { tabIndex: 7, required: false, key: 'gender', label: 'Gender' },
            { tabIndex: 8, required: false, key: 'phone', label: 'Phone' },
            { tabIndex: 9, required: false, key: 'location', label: 'Address' },
            { tabIndex: 10, required: false, key: 'remarks', label: 'Remarks', component: 'textarea' },
        ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log({ user })
        // return
        if (!user?.id) {
            toast.error("User not authenticated. Cannot save profile.");
            return;
        }

        setLoading(true)
        try {
            const dataToUpsert: UserInsert = {
                ...form,
                // --- CRUCIAL: Pass the user's auth_id and created_by fields ---
                auth_id: user.id, // Supabase Auth ID (UUID) is used for the upsert check
                created_by: user.id, // Foreign key to auth.users for creation
            } as UserInsert

            await upsertUserProfile(dataToUpsert)

            toast.success('User profile saved successfully!')

        } catch (error: any) {
            const errorMessage = error.message || 'An unknown error occurred during saving.'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }


    const handleChange = (key: keyof UserInsert, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    useEffect(() => {
        const getuser = async () => {
            const { data: { session } } = await db.auth.getSession()
            if (!session) return
            setuser(session?.user)
            // Optional: Fetch existing user profile data to pre-fill the form here
        }
        getuser()
    }, [])

    // Ensure the form keys match the UserInsert type definition
    // ... (Your JSX remains largely the same)
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... form content ... */}
            <div>
                <div className="md:grid  md:grid-cols-3 gap-4 px-4">
                    {fields.map((field) => (
                        <div
                            key={field.key.toString()}
                            className={`${field.component === 'textarea' ? 'col-span-3' : ''} mt-2 grid gap-2 md:mt-0 `}
                        >
                            <Label required={field.required} >{field.label}</Label>

                            {field.key == "gender" ? <InputDropDown
                                data={DefaultGenders}
                                columns={ColumnsYesOrNoCodeOnly}
                                onClick={(e) =>
                                    handleChange(
                                        field.key,
                                        field.type === 'date'
                                            ? new Date(e.code).toISOString()
                                            : e.code
                                    )
                                }
                            /> :
                                field.component === 'textarea' ? (
                                    <Textarea
                                        value={form[field.key] || ''}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                    />
                                ) : (
                                    <Input
                                        className='date-input'
                                        tabIndex={field.tabIndex}
                                        required={field.required}
                                        type={field.type || 'text'}
                                        // Type casting needed here since form is Partial<UserInsert>
                                        value={
                                            field.type === 'date'
                                                ? form[field.key as keyof UserInsert]
                                                    ? (form[field.key as keyof UserInsert] as string).split('T')[0]
                                                    : ''
                                                : (form[field.key as keyof UserInsert] as string) || ''
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                field.key,
                                                field.type === 'date'
                                                    ? new Date(e.target.value).toISOString()
                                                    : e.target.value
                                            )
                                        }
                                    />
                                )
                            }
                        </div>
                    ))}
                </div>
                <div className='p-4'>
                    <Button type='submit' disabled={loading}>
                        {loading ? 'Saving...' : 'Save Profile'}
                    </Button>
                </div>
            </div>
        </form>
    )
}