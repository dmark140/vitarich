import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import ChildFolder from '@/components/ChildFolder'
import Layout from './Layout'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='Hatchery' fatherLink='./' fatherLabel=''>
                <Layout />
            </SideBarMain>

        </div>
    )
}