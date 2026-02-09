import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import ChildFolder from '@/components/ChildFolder'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='Hatchery' fatherLink='./' fatherLabel=''>
                <ChildFolder id={2} />
            </SideBarMain>

        </div>
    )
}