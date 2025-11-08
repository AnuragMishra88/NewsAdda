import React, { Component } from 'react'

export default class NewsItems extends Component {
  render() {
    let { title, description, imageurl, newsurl, publishedAt, By, source } = this.props;
    return (
      <div className='my-3'>
        <div className="card h-100 shadow-sm" style={{ width: "100%", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
          
          {/* ✅ Source badge now stays inside the top-right corner */}
          <div 
            className="badge bg-danger text-light position-absolute" 
            style={{ 
              top: "10px", 
              right: "10px", 
              padding: "6px 10px", 
              fontSize: "0.75rem", 
              borderRadius: "8px" 
            }}
          >
            {source}
          </div>

          {/* Image */}
          <img 
            src={
              !imageurl 
                ? "https://s.hdnux.com/photos/01/53/54/33/28231397/7/rawImage.jpg" 
                : imageurl
            } 
            className="card-img-top" 
            alt="news" 
            style={{ height: "180px", objectFit: "cover" }}
          />

          {/* Card Body */}
          <div className="card-body d-flex flex-column justify-content-between" style={{ minHeight: "250px" }}>
            <div>
              <h5 className="card-title" style={{ fontSize: "1rem", fontWeight: "600" }}>
                {title ? title.slice(0, 70) + (title.length > 70 ? "..." : "") : ""}
              </h5>
              <p className="card-text" style={{ fontSize: "0.9rem", color: "#ccc" }}>
                {description ? description.slice(0, 100) + (description.length > 100 ? "..." : "") : ""}
              </p>
            </div>

            {/* Author + Date + Button */}
            <div>
              <p className="card-text mb-1">
                <small className="text-muted">By {By ? By : "Unknown"}</small>
              </p>
              <p className="card-text">
                <small className="text-muted">{publishedAt}</small>
              </p>
              <a 
                href={newsurl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-sm btn-dark w-100"
              >
                Read More...
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
