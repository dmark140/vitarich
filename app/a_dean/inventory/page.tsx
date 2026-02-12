import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import ChildFolder from '@/components/ChildFolder'
import Breadcrumb from '@/lib/Breadcrumb'
import { Separator } from '@/components/ui/separator'

export default function page() {
    return (
        <div>

            <div className='p-4'>
                <Breadcrumb
                    CurrentPageName='Inventory '
                />
            </div>
            <Separator />

            {/* <NavigationBar currentLabel='Hatchery' fatherLink='./' fatherLabel=''> */}
            <ChildFolder id={2} />
            {/* </NavigationBar> */}

        </div>
    )
}