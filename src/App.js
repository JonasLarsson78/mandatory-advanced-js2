import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {Helmet} from "react-helmet";
import AddMovies from './add.js';
import EditMovies from './edit.js';
import Info from './info.js';
import axios from 'axios';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import './App.css';

class Table extends Component{
  constructor(props){
    super(props);
    this.state = {input: ""}
  }

  renderMovies = (obj) =>{
    let rating = parseFloat(obj.rating).toFixed(1);
   
    return (
      <tr key={obj.id}>
        <td><Link to={"/info/" + obj.id}>{obj.title}</Link></td>
        <td>{obj.director}</td>
        <td><center><Rater total={5} interactive={false} rating={Number(rating)}/> ({rating})</center></td>
        <td><center><Link to={"/edit/" + obj.id}><button className="btn"><span>Edit</span></button></Link></center></td>
        <td><center><button className="btn" data-id={obj.id} onClick={this.delMovies}>Del</button></center></td>
      </tr>
    );
  }
  onChange = (e) =>{
    this.setState({input: e.target.value})
    }


  delMovies = (e) =>{
      let id = e.target.dataset.id;
      this.props.onDelete(id);
    }

  render(){
    let data =this.props.data;
    const filter = data.filter((x) =>{
      return(
        x.title.toLowerCase().includes(this.state.input.toLowerCase()) ||
        x.director.toLowerCase().includes(this.state.input.toLowerCase())
      );
    });
    let newData = filter.map(this.renderMovies);
    if(newData.length === 0){
      newData = 
        <tr>
          <td colSpan="5"><center>No movies in the list...</center></td>
        </tr>
    }
    
    
    return (
     <div className="main">
     <input className="mainS" onChange={this.onChange} placeholder="Search.." type="text"/>
     <table className="rederTable" border="1">
       <thead>
          <tr>
            <th>Titel</th>
            <th>Director</th>
            <th>Rating</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
       </thead>
       <tbody>
         {newData}
       </tbody>
     </table> 
     </div>
    );
  }
}

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {data: []};

    this.onDelete = this.onDelete.bind(this);
  }

  

  componentDidMount() {
    axios.get("http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies")
      .then(response => {
        this.setState({data: response.data });
      });
  }
  
  onDelete(id)  {
    const { data } = this.state;

    axios.delete("http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/" + id)
      .then(response => {
        if (response.status === 204) {
          const index = data.findIndex(x => x.id === id);

          console.log(index);

          if (index >= 0) {
            const newData = [...data.slice(0, index), ...data.slice(index + 1)];

            this.setState({ data: newData });
          }
        } 
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          const index = data.findIndex(x => x.id === id);

          console.log(index);

          if (index >= 0) {
            const newData = [...data.slice(0, index), ...data.slice(index + 1)];

            this.setState({ data: newData });
          }
        } 

      })
  }

  render() {
   return(
     <>
     <Helmet>
       <title>Home</title>
     </Helmet>
    
    <Table onDelete={this.onDelete} data={this.state.data}></Table>
   </>
   );
  }
}
class App extends Component{
  


  render() {
    return(
     <Router>
     <>
     
     
     <div className="mainBtn">
     <h1>AvJS Lab 2 - Movie API</h1>
      <Link to="/">
        <button className="btn">
          <span>Home</span>
        </button>
      </Link>
      
      <Link to="/add">
        <button className="btn">
          <span>Add</span>
        </button>
      </Link><br/><br/>
      
     </div>
     
     <Route exact path="/" component={Main}/>
     <Route path="/add" component={AddMovies}/>
     <Route path="/edit/:id" component={EditMovies}/>
     <Route path="/info/:id" component={Info}/>
     </>
     </Router>
    );
   }
}

export default App;
