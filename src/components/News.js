import React, { Component } from "react";
import NewsItems from "./NewsItems";
import { Spinner } from "./Spinner";
import PropTypes from "prop-types";

export class News extends Component {
  static defaultProps = {
    pageSize: 9,
    country: "us",
    category: "general",
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

  // Guardian API - COMPLETELY FREE, NO API KEY NEEDED
  buildUrl = (page) => {
    const categoryMap = {
      general: '',
      business: 'business',
      entertainment: 'culture',
      health: 'society',
      science: 'science',
      sports: 'sport',
      technology: 'technology'
    };

    const category = categoryMap[this.props.category] || '';
    const pageSize = this.props.pageSize;
    
    let url = `https://content.guardianapis.com/search?api-key=test&show-fields=thumbnail,headline,trailText,byline&page-size=${pageSize}&page=${page}`;
    
    if (category) {
      url += `&section=${category}`;
    }
    
    return url;
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
    
    try {
      let url = this.buildUrl(page);
      let response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to load news: ${response.status}`);
      }
      
      let parsedata = await response.json();
      
      if (parsedata.response && parsedata.response.results) {
        const articles = parsedata.response.results.map(item => ({
          title: item.fields?.headline || item.webTitle,
          description: item.fields?.trailText || 'Click to read more...',
          url: item.webUrl,
          urlToImage: item.fields?.thumbnail,
          publishedAt: item.webPublicationDate,
          author: item.fields?.byline || 'The Guardian',
          source: { name: 'The Guardian' }
        }));
        
        this.setState({
          articles: articles,
          totalresult: parsedata.response.total || 0,
          loading: false,
        });
      } else {
        throw new Error("No articles found");
      }
      
    } catch (error) {
      console.error("Error:", error);
      this.setState({ 
        articles: [],
        loading: false,
        error: "Failed to load news. Please try again later."
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
        <h1 className="text-center my-4">NewsAdda - Top Headlines</h1>
        
        {error && (
          <div className="alert alert-warning text-center" role="alert">
            {error}
          </div>
        )}
        
        {loading && <Spinner />}
        
        <div className="row">
          {!loading && !error && articles.length > 0 ? (
            articles.map((element, index) => (
              <div className="col-md-4 mb-4" key={element.url || index}>
                <NewsItems
                  title={element.title}
                  description={element.description}
                  imageurl={element.urlToImage}
                  newsurl={element.url}
                  publishedAt={new Date(element.publishedAt).toGMTString()}
                  By={element.author}
                  source={element.source.name}
                />
              </div>
            ))
          ) : !loading && !error ? (
            <div className="col-12 text-center">
              <p>No articles found.</p>
            </div>
          ) : null}
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