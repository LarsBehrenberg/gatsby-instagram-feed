import React from "react"

// Styles
import "./instagram.css"

export default class Instagram extends React.Component {
  state = { photos: [], loading: true }

  // Your specifications
  INSTAGRAM_ID = "787132"
  THUMBNAIL_WIDTH = 640
  PHOTO_COUNT = 30

  async componentDidMount() {
    try {
      // Hack from https://stackoverflow.com/a/47243409/2217533
      const response = await fetch(
        `https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={"id":"${this.INSTAGRAM_ID}","first":${this.PHOTO_COUNT},"after":null}`
      )
      const { data } = await response.json()
      const photos = data.user.edge_owner_to_timeline_media.edges.map(
        ({ node }) => {
          const { id } = node
          const comments = node.edge_media_to_comment.count
          const likes = node.edge_media_preview_like.count
          const caption = node.edge_media_to_caption.edges[0].node.text
          const thumbnail = node.thumbnail_resources.find(
            thumbnail => thumbnail.config_width === this.THUMBNAIL_WIDTH
          )
          const { src, config_width: width, config_height: height } = thumbnail
          const url = `https://www.instagram.com/p/${node.shortcode}`
          return {
            id,
            caption,
            src,
            width,
            height,
            url,
            comments,
            likes,
          }
        }
      )
      this.setState({ photos, loading: false })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <div className="post-wrapper">
        {this.state.loading === true ? (
          <div style={{ textAlign: "center" }}>
            <h1>Loading ...</h1>
          </div>
        ) : (
          this.state.photos &&
          this.state.photos.map(
            ({ src, url, id, likes, comments, caption }) => (
              <a
                href={url}
                target="_blank"
                className="post-item"
                rel="noopener noreferrer"
                key={id}
              >
                <img
                  src={src}
                  className="post-image"
                  alt={caption.substring(0, 40)}
                />
                {/*  */}
                <div className="post-item-info">
                  <ul>
                    <li className="post-item-likes">
                      <span role="img" aria-label="heart">
                        <svg
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                          fill="white"
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.45",
                          }}
                        >
                          <path d="M12 4.435C10.011-.964 0-.162 0 8.003 0 12.071 3.06 17.484 12 23c8.94-5.516 12-10.929 12-14.997C24-.115 14-.996 12 4.435z"></path>
                        </svg>
                      </span>{" "}
                      {likes !== null ? likes.toLocaleString() : 0}
                    </li>
                    <li className="post-item-comments">
                      <span role="img" aria-label="speech-balloon">
                        <svg
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                          fill="white"
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.45",
                          }}
                        >
                          <path d="M24 9.874C24 4.42 18.627 0 12 0S0 4.42 0 9.874c0 4.512 3.678 8.317 8.701 9.496L12 24l3.299-4.63C20.322 18.19 24 14.385 24 9.874z"></path>
                        </svg>
                      </span>{" "}
                      {comments !== null ? comments.toLocaleString() : 0}
                    </li>
                  </ul>
                </div>
              </a>
            )
          )
        )}
      </div>
    )
  }
}
