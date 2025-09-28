import { Image } from 'antd';

function ArticleContentRenderer({ contents }) {
  if (!contents || contents.length === 0) return null;

  // Sắp xếp theo orderIndex trước khi render
  const sortedContents = [...contents].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div>
      {sortedContents.map((block) => {
        switch (block.type) {
          case "Paragraph":
            return (
              <div
                key={block.id}
                className="my-4"
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            );

          case "Image":
            return (
              <div key={block.id} className="my-4 text-center">
                <Image
                  src={block.image.url}
                  alt={block.image.altText}
                  style={{ width: "100%", height: "auto" }}
                />
                {block.image.caption && (
                  <p className="text-muted fst-italic bg-light p-2 text-center mx-3">
                    {block.image.caption} {' '} {`(Ảnh: ${block.image.credits})`}
                  </p>
                )}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default ArticleContentRenderer;
