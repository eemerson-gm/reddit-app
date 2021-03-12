import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
import heart from './heart.webp'
import remove from './remove.png'

class App extends React.Component{

  constructor(props){

    //Binds the subreddit change handeler and value.
    super(props);
    this.state = {time: 0,subreddit: '', posts: [], favs: [], favposts: []}
    this.subredditChange = this.subredditChange.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.updateFavorites = this.updateFavorites.bind(this);

    //Gets the reddit url formatting.
    this.url = "https://www.reddit.com";
    if(window.sessionStorage.getItem("favs") != null){
      this.state.favs = JSON.parse(window.sessionStorage.getItem("favs"));
      console.log(this.state.favs)
    }

  }

  componentDidMount(){
    this.updateFavorites();
  }

  subredditChange(event){

    //Changes the value of the subreddit.
    this.setState({posts: []})
    this.setState({subreddit: event.target.value})

    //Gets a list of values from the subreddit json.
    axios.get(this.url + "/r/" + event.target.value + "/hot.json?limit=10")
    .then((res) => {
      const posts = res.data.data.children.map(obj => obj.data)
      this.setState({
        posts: posts
      })
      console.log(posts)
    })
    .catch(error =>{
      console.error(error)
    })

  }

  addFavorite(event){

    //Adds the favorite id to the session storage.
    var array = this.state.favs;
    array.push(event.target.getAttribute("data-id"))
    this.setState({
      favs: array
    })
    window.sessionStorage.setItem("favs", JSON.stringify(this.state.favs))
    this.updateFavorites()
  
  }

  removeFavorite(event){

    //Removes the favorite from the array.
    var array = this.state.favs;
    var index = array.indexOf(event.target.getAttribute("data-id"))
    if(index !== -1){
      array.splice(index, 1)
      this.setState({
        favs: array
      })
      window.sessionStorage.setItem("favs", JSON.stringify(this.state.favs))
      this.updateFavorites()
    }
  }

  updateFavorites(){

    this.setState({
      favposts: []
    })
    this.state.favs.map((fav, i) => 
      axios.get("https://api.reddit.com/api/info/?id=" + fav)
      .then((res) => {
        var array = this.state.favposts;
        array.push(res.data.data.children[0].data)
        this.setState({
          favposts: array
        })
      }
    ))
    console.log(this.state.favposts)
  }

  render(){
    return (
      <div>
        <table class="column">
          <tbody>
            <tr>
              <td>
                <div class="search">
                  <form onSubmit={this.subredditChange} method="GET">
                    <label>
                      Subreddit: r/
                      <input type="text" name="r" value={this.state.subreddit} onChange={this.subredditChange} />
                    </label>
                  </form>
                </div>
              </td>
              <td>
                <div class="search">
                  Favorites:
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <table class="column">
                  <tbody>
                    <tr>
                      <td>
                        {Object.keys(this.state.posts).map((post, i) =>
                          <div class="post" key={post}>
                            <table class="post">
                              <tbody>
                                <tr>
                                  <td>
                                    <h3>
                                      {this.state.posts[post].score}
                                    </h3>
                                  </td>
                                  <td>
                                    {this.state.posts[post].title}
                                  </td>
                                  <td>
                                    <img alt="fav" class="heart" data-id={this.state.posts[post].name} src={heart} onClick={this.addFavorite}></img>
                                  </td>
                                </tr>
                                <tr>
                                  <td></td>
                                  <td><a class="post" href={this.url + this.state.posts[post].permalink}>{this.url + this.state.posts[post].permalink}</a></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>
                <table class="column">
                  <tbody>
                    <tr>
                      <td>
                        {Object.keys(this.state.favposts).map((favpost) =>
                          <div class="post" key={favpost}>
                            <table class="post">
                              <tbody>
                                <tr>
                                  <td>
                                    <h3>
                                      {this.state.favposts[favpost].score}
                                    </h3>
                                  </td>
                                  <td>
                                    {this.state.favposts[favpost].title}
                                  </td>
                                  <td>
                                    <img alt="fav" class="heart" data-id={this.state.favposts[favpost].name} src={remove} onClick={this.removeFavorite}></img>
                                  </td>
                                </tr>
                                <tr>
                                  <td></td>
                                  <td><a class="post" href={this.url + this.state.favposts[favpost].permalink}>{this.url + this.state.favposts[favpost].permalink}</a></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
