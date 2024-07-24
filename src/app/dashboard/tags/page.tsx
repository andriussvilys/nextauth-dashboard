import { listAll } from "@/src/lib/tags"
import Link from "next/link"
import DashboardTag from "@/src/components/dashboardTag"
import Tag from "@/src/components/tags/tag"

export default async function Page() {
    const tags = (await listAll()).results
    return (
        <main>
            <h1>Tags</h1>
            <Link href="/dashboard/tags/create">Create new tag</Link>
            {tags.map((tag: any) => {
                return(
                    <DashboardTag key={tag.key} tag={tag}>
                        <Tag tag={tag}/>
                    </DashboardTag>
                )
            })}
        </main>
    )
}