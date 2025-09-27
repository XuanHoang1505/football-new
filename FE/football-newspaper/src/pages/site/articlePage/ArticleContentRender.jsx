import React from "react";
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
            return <p key={block.id} className="my-3">{block.text}</p>;

          case "Heading1":
            return <h2 key={block.id} className="my-3">{block.text}</h2>;

          case "Heading2":
            return <h3 key={block.id} className="my-3">{block.text}</h3>;

          case "Image":
            return (
              <div key={block.id} className="my-3 text-center ">
                <Image
                  src={block.image.url}
                  alt={block.image.altText}
                  className="img-fluid"
                />
                {block.image.caption && (
                  <p className="text-muted fst-italic">{block.image.caption}</p>
                )}
              </div>
            );

          case "Quote":
            return (
              <blockquote key={block.id} className="blockquote ">
                {block.text}
              </blockquote>
            );

          case "Code ":
            return (
              <pre key={block.id}>
                <code>{block.text}</code>
              </pre>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default ArticleContentRenderer;
