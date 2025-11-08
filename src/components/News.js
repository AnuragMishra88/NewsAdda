import React, { Component } from "react";
import NewsItems from "./NewsItems";
import { Spinner } from "./Spinner";
import PropTypes from "prop-types";

export class News extends Component {
  static defaultProps = {
    pageSize: 8,
    country: "us",
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalresult: 0,
      error: null
    };
  }

  // Helper method to build URL
  buildUrl = (page) => {
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    console.log("API Key being used:", apiKey ? "Present" : "Missing"); // Debug
    return `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${apiKey}&page=${page}&pageSize=${this.props.pageSize}`;
  };

  async componentDidMount() {
    if (this.props.setProgress) {
      this.props.setProgress(10);
    }
    await this.fetchNews(this.state.page);
    if (this.props.setProgress) {
      this.props.setProgress(100);
    }
  }

  fetchNews = async (page) => {
    this.setState({ loading: true, error: null });
    
    // Check if API key is available
    if (!process.env.REACT_APP_NEWS_API_KEY) {
      this.setState({ 
        loading: false, 
        error: "API key is missing. Please check your .env file." 
      });
      return;
    }
    
    try {
      let url = this.buildUrl(page);
      console.log("API URL:", url.replace(process.env.REACT_APP_NEWS_API_KEY, 'HIDDEN')); // Hide key in logs
      
      let response = await fetch(url);
      
      if (response.status === 401) {
        throw new Error("Invalid API Key. Please check your NewsAPI key.");
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let parsedata = await response.json();
      
      if (parsedata.status === "error") {
        throw new Error(parsedata.message || "API Error");
      }
      
      if (parsedata.articles && Array.isArray(parsedata.articles)) {
        this.setState({
          articles: parsedata.articles,
          totalresult: parsedata.totalResults || 0,
          loading: false,
        });
      } else {
        throw new Error("No articles found in response");
      }
      
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ 
        articles: [],
        loading: false,
        error: error.message
      });
    }
  };

  handlenextclick = async () => {
    if (!(this.state.page + 1 > Math.ceil(this.state.totalresult / this.props.pageSize))) {
      const nextPage = this.state.page + 1;
      await this.fetchNews(nextPage);
      this.setState({ page: nextPage });
    }
  };

  handleprevclick = async () => {
    const prevPage = this.state.page - 1;
    if (prevPage >= 1) {
      await this.fetchNews(prevPage);
      this.setState({ page: prevPage });
    }
  };

  render() {
    const { articles, loading, error, page, totalresult } = this.state;
    
    return (
      <div className="container my-3">
        <h1 className="text-center my-4">NewsAdda HEADLINES</h1>
        
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            <strong>Error:</strong> {error}
            <br />
            <small>
              Steps to fix:
              <ul className="text-start">
                <li>Get a free API key from newsapi.org</li>
                <li>Add REACT_APP_NEWS_API_KEY=your_key to .env file</li>
                <li>Restart your development server</li>
              </ul>
            </small>
          </div>
        )}
        
        {loading && <Spinner />}
        
        <div className="row">
          {!loading && !error && articles.length > 0 ? (
            articles.map((element) => (
              <div className="col-md-4" key={element.url || Math.random()}>
                <NewsItems
                  title={element.title || ""}
                  description={element.description || ""}
                  imageurl={element.urlToImage}
                  newsurl={element.url}
                  publishedAt={element.publishedAt ? new Date(element.publishedAt).toGMTString() : "Unknown date"}
                  By={element.author || "Unknown"}
                  source={element.source?.name || "Unknown source"}
                />
              </div>
            ))
          ) : !loading && !error && (
            <div className="col-12 text-center">
              <p>No articles found.</p>
            </div>
          )}
        </div>
        
        {!error && articles.length > 0 && (
          <div className="container d-flex justify-content-between">
            <button
              disabled={page <= 1}
              type="button"
              className="btn btn-dark"
              onClick={this.handleprevclick}
            >
              &larr; Previous
            </button>
            <button
              disabled={page + 1 > Math.ceil(totalresult / this.props.pageSize)}
              type="button"
              className="btn btn-dark"
              onClick={this.handlenextclick}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default News;