import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import NewTask from './NewTask'
export default function page() {
    return (
        <div>
            <NavigationBar currentLabel='User' fatherLabel='Administrator' fatherLink='' >
                <div className='max-w-7xl mx-auto px-4 '>
                    <NewTask />
                </div>
            </NavigationBar>
        </div>
    )
}

