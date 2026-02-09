import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import ChildFolder from '@/components/ChildFolder'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='Hatchery' fatherLink='./' fatherLabel=''>
                <ChildFolder id={3} />
            </SideBarMain>

        </div>
    )
}