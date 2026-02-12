import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import ChildFolder from '@/components/ChildFolder'
import Layout from './Layout'

export default function page() {
    return (
        <div>
            {/* <NavigationBar currentLabel='Warehouse Master' fatherLink='./' fatherLabel='Inventory Management'> */}
                <Layout />
            {/* </NavigationBar> */}

        </div>
    )
}