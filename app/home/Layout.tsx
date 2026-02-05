
'use client'
import { Card } from '@/components/ui/card'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { DataTable } from '@/lib/DataTable'
import { ColumnsYesOrNo, ColumnsYesOrNo_NoCodev } from '@/lib/DefaultColumns'
import { DataYesOrNo } from '@/lib/DefaultValues'
import { InputDropDown } from '@/lib/InputDropDown'
import { javascript } from '@codemirror/lang-javascript'
import ReactCodeMirror, { oneDark } from '@uiw/react-codemirror'
import React, { useEffect } from 'react'

export default function Layout() {
    const { setValue, getValue } = useGlobalContext()
    useEffect(() => {
        setValue('loading_g', false)
    }, [])

    return (
        <div>

            <b>Important Components</b>
            <div className=' grid gap-4'>
                <div className=''>
                    <Card className='p-4'>
                        <b>Supabase blocking</b>
                        <p className='p-0 m-0'> Lets say i Have a new Table called UoM <br />
                            then the code must be unique<br />
                            1st : Create the trigger of that table<br />
                            {`(if its not existing)`}
                        </p>
                        <ReactCodeMirror
                            value={`insert into public.blocking_rules
  (query_name, table_name, when_event, condition_sql, params, error_message, is_active)
values
(
  'UoM code unique', //query_name
  'UoM', //table_name
  'INSERT,UPDATE', //when_event NOTE: delete is disabled ,
  $$
    select 1
    from "UoM"
    where code = $1::text
      and ( $2::int is null OR id <> $2::int ) // note !IMPORTANT! in order to only look the other records
    limit 1
  $$, //condition_sql
  array['code','id'], //params
  'UoM code already exists', //error_message
  true
);
                                `}

                            height="360px"
                            theme={oneDark}
                            extensions={[javascript({ jsx: true })]}
                        />
                        2nd : create the trigger that will block if the 1st step has record(s)
                        <ReactCodeMirror
                            value={` drop trigger if exists trg_blocking_uom on "Uom";
create trigger trg_blocking_uom
before insert or update on "uom"
for each row execute function public.generic_blocking_trigger();
`}

                            height="130px"
                            theme={oneDark}
                            extensions={[javascript({ jsx: true })]}
                        />
                    </Card>
                </div>

                <div className=''>
                    <Card className='p-4'>
                        <b>InputDropDown</b>
                        <InputDropDown
                            columns={ColumnsYesOrNo_NoCodev}
                            data={DataYesOrNo}
                            onClick={(e) => console.log(e)}
                            label={"item.label"}
                            name={"item.name"}
                            placeholder={"item.placeholder"}
                            disabled={false}
                            required={true}
                        />


                        <ReactCodeMirror
                            value={`<InputDropDown
  columns={Columns} // cols must have type
  data={DataYesOrNo} // same type as cols 
  onClick={(e) => console.log(e)} // row on click, returns all the data in that row
  label={"item.label"} 
  name={"item.name"} 
  placeholder={"item.placeholder"}
  disabled={false}
  required={true} // you need forms to acctivate this 
/>
                                
                                `}
                            height="250px"
                            theme={oneDark}
                            extensions={[javascript({ jsx: true })]}
                        // onChange={(value) => sendStatusCode(value)}
                        />
                    </Card>
                </div>



                <div className=''>
                    <div className='grid gap-2'>
                    </div>

                    <Card className='p-4'>
                        <div className='grid'>
                            <span>DataTable - single page</span>
                            <span className='text-muted-foreground'>use this when you are using global values ,</span>
                        </div>
                        <DataTable
                            columns={ColumnsYesOrNo}
                            data={DataYesOrNo}
                            loading={false}
                            hideOption
                        />


                        <ReactCodeMirror
                            value={` <DataTable
    columns={ColumnsYesOrNo}
    data={DataYesOrNo}
    loading={false}
    hideOption // <--- hide options
    />                   
     `}
                            height="150px"
                            theme={oneDark}
                            extensions={[javascript({ jsx: true })]}
                        // onChange={(value) => sendStatusCode(value)}
                        />
                    </Card>
                </div>




                <div className=''>
                    <div className='grid gap-2'>
                    </div>

                    <Card className='p-4'>
                        <div className='grid'>
                            <span>DataTable - Multi Option</span>
                            <span className='text-muted-foreground'>Allows pagination</span>
                        </div>
                        <DataTable
                            columns={ColumnsYesOrNo}
                            data={DataYesOrNo}
                            loading={false}
                            page={2}
                            limit={50}
                            totalCount={10}
                            onPageChange={() => { }}
                            onLimitChange={() => { }}
                            searchable
                        />


                        <ReactCodeMirror
                            value={` <DataTable
  columns={ColumnsYesOrNo}
  data={DataYesOrNo}
  loading={false}
  page={2}
  limit={50}
  totalCount={10}
  onPageChange={() => { }}
  onLimitChange={() => { }} 
  searchable
/>                       
     `}
                            height="250px"
                            theme={oneDark}
                            extensions={[javascript({ jsx: true })]}
                        // onChange={(value) => sendStatusCode(value)}
                        />
                    </Card>
                </div>



            </div>


        </div>
    )
}
