import SideBarMain from '@/components/ui/sidebar/SideBarMain'    
import Hatchfromx from './Hatchform'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='Hatch Classification Information' fatherLink='./' fatherLabel='Hatchery'>
                <Hatchfromx />
            </SideBarMain>

        </div>
    )
}