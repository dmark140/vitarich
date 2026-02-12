import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import ChildFolder from '@/components/ChildFolder'
import Breadcrumb from '@/lib/Breadcrumb'
import { Separator } from '@/components/ui/separator'

export default function page() {
    return (
        <div>
            <div className='p-4'>
                <Breadcrumb
                    CurrentPageName='Hatchery '
                />
            </div>
            <Separator />


            {/* <NavigationBar currentLabel='Hatchery' fatherLink='./' fatherLabel=''> */}
            <ChildFolder id={1} />
            {/* 
            <NavigationBar currentLabel='Master and Reports' fatherLink='./' fatherLabel='Hatchery'>
                <Layout /> */}
            {/* </NavigationBar> */}

        </div>
    )
}