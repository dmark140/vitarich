import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import ChildFolder from '@/components/ChildFolder'

export default function page() {
    return (
        <div>
            <NavigationBar currentLabel='Hatchery' fatherLink='./' fatherLabel=''>
                <ChildFolder id={1} />
{/* 
            <NavigationBar currentLabel='Master and Reports' fatherLink='./' fatherLabel='Hatchery'>
                <Layout /> */}
            </NavigationBar>

        </div>
    )
}