import React, { Component } from "react";
import axios from "axios";
import { debounce } from "../utils";
import SearchForm from "../components/SearchForm";
export default class Index extends Component {
  state = {
    currentPlaylistID: "47Ne6hrPVXzA72EhtVE93H",
    selectedMovie: {},
    movies: [],
    searchingForMovie: false,
    searchingForPlaylist: false,
    searchTerm: ""
  };
  handleChange = searchTerm => {
    this.setState({ searchTerm }, this.getMovieDetails);
  };
  handleSelect = selectedMovie => {
    this.setState({ selectedMovie }, this.getSoundTrackList);
  };
  getMovieDetails = debounce(() => {
    const tmdbURL = "https://api.themoviedb.org/3/search/movie";
    this.setState({ searchingForMovie: true });
    axios
      .get(tmdbURL, {
        params: {
          query: this.state.searchTerm,
          api_key: "e1ba7a7de4337da1bc251e9129fb8cba"
        }
      })
      .then(response => {
        this.setState({
          movies: response.data.results,
          searchingForMovie: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  });
  componentDidMount = () => {
    //this.getSoundTrackList({ title: "Black Panther", release_date: "2018" });
  };
  getSoundTrackList = selectedMovie => {
    if (selectedMovie === null) return;
    this.setState({ searchingForPlaylist: true });
    const soundtrackAPIURL = "/search";
    this.setState({ selectedMovie });
    axios.post(soundtrackAPIURL, { selectedMovie }).then(response => {
      this.setState({
        currentPlaylistID: response.data.playlistId,
        searchingForPlaylist: false
      });
    });
  };
  render = () => {
    const {
      movies,
      searchingForPlaylist,
      searchingForMovie,
      currentPlaylistID
    } = this.state;
    return (
      <div>
        <SearchForm
          movies={movies}
          searchingForMovie={searchingForMovie}
          handleChange={this.handleChange}
          handleSelect={this.getSoundTrackList}
        />
        {searchingForPlaylist ? (
          <h1>Searching...</h1>
        ) : (
          <div>
            {currentPlaylistID ? (
              <iframe
                src={`https://open.spotify.com/embed/user/12152339910/playlist/${currentPlaylistID}`}
                width="300"
                height="380"
                frameBorder="0"
                allowtransparency="true"
                allow="encrypted-media"
              />
            ) : (
              <div>
                <h1>Playlist not found</h1>
                <p>Leave your email and we will get back to you</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
}
