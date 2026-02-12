import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import ChildFolder from '@/components/ChildFolder'

export default function page() {
    return (
        <div>
            <NavigationBar currentLabel='Hatchery' fatherLink='./' fatherLabel=''>
                <ChildFolder id={2} />
            </NavigationBar>

        </div>
    )
}