import getIconFromKey from '../_common/getIconFromKey'
interface RenderTagsProps {
  tags: string[]
}
const RenderTags: React.FC<RenderTagsProps> = ({ tags }) => {
  return tags.map((tag: string) => {
    return (
      <div
        key={tag}
        className="border-greyscale-50/12 bg-greyscale-50/8 relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-muted p-1.5 transition-all duration-300 ease-in"
      >
        {getIconFromKey(tag)}
      </div>
    )
  })
}

export default RenderTags
