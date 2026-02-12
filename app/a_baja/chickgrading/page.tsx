import NavigationBar from '@/components/ui/sidebar/NavigationBar' 
import Chickgrading from './Chickgrading'

export default function page() {
    return (
        <div>
            <NavigationBar currentLabel='Chick Grading Information' fatherLink='./' fatherLabel='Hatchery'>
                <Chickgrading />
            </NavigationBar>

        </div>
    )
}