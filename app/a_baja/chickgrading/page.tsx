import SideBarMain from '@/components/ui/sidebar/SideBarMain' 
import Chickgrading from './Chickgrading'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='Chick Grading Information' fatherLink='./' fatherLabel='Hatchery'>
                <Chickgrading />
            </SideBarMain>

        </div>
    )
}