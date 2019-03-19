import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {Helmet} from "react-helmet";
import AddMovies from './add.js';
import EditMovies from './edit.js';
import Info from './info.js';
import axios from 'axios';
import Rater from 'react-rater'
import './App.css';
import 'react-rater/lib/react-rater.css'

class Table extends Component{
  constructor(props){
    super(props);
    this.state = {input: "", errorMess: "", scrollY: 0}
  }
  componentDidMount(){
    window.addEventListener('scroll', this.scroll);
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.scroll);
  }
  
  scroll = () =>{
    
    let y = window.pageYOffset
    let newY = parseFloat(y.toFixed(0));
    this.setState({scrollY: newY})
  }

  renderMovies = (obj) =>{
    let rating = parseFloat(obj.rating).toFixed(1);
    
    let newDescription= obj.description.slice(0, 125);
   
    return (
      <tr key={obj.id}>
        <td>
        <Link className="tooltip" to={"/info/" + obj.id}>{obj.title}       
        <span className="tooltiptext" style={{ marginTop: `${this.state.scrollY / 2 + 130}px` }}>
          <div><b>Title:</b></div>
          <div>{obj.title}</div><br/>
          <div><b>Short Description:</b></div>
          <span>{newDescription}...</span>
        </span>
        </Link> 
        </td>
        <td>{obj.director}</td>
        <td className="rateSize"><center><Rater total={5} interactive={false} rating={Number(rating)}/> <span className="rateNum">({rating})</span></center></td>
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
            <th style={{borderRadius: '10px 0 0 0'}}>Title:</th>
            <th>Director:</th>
            <th>Rating:</th>
            <th>Edit:</th>
            <th style={{borderRadius: '0 10px 0 0'}}>Delete:</th>
          </tr>
       </thead>
       <tbody>
         {newData}
       </tbody>
       <tfoot>
         <tr>
           <td colSpan="5" style={{borderRadius: '0 0 10px 10px', backgroundColor: "#4CAF50"}}/>
         </tr>
       </tfoot>
     </table> 
     </div>
    );
  }
}

class Main extends Component {
  constructor(props){
    super(props);
    this.state = {data: []};

  }
getAxiosData = () =>{
  this.source = axios.CancelToken.source();
  axios.get("http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies",
  {cancelToken: this.source.token})
  .then(response => {
    //console.log(response)
    
    this.setState({data: response.data });
  })
  .catch(error =>{
    if (axios.isCancel(error)){
      return;
      }
    if (error.response && error.response.status === 404){
        this.setState({errorMess: "Wrong Connection!! Try to reload page."})
    }
  });
}

  componentDidMount() {
    this.getAxiosData();
  }
  componentWillUnmount(){
    if (this.source){
      this.source.cancel();
      }
  }
  
  onDelete = (id) =>  {
    const { data } = this.state;
    this.source = axios.CancelToken.source();
    axios.delete("http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/" + id,
    {cancelToken: this.source.token})
      .then(response => {
        if (response.status === 204) {
          const index = data.findIndex(x => x.id === id);
          if (index >= 0) {
            const newData = [...data.slice(0, index), ...data.slice(index + 1)];
            this.setState({ data: newData });
          }
        } 
      })
      .catch(error => {
        if (axios.isCancel(error)){
          return;
          }
        if (error.response && error.response.status === 404) {
          const index = data.findIndex(x => x.id === id);

          if (index >= 0) {
            const newData = [...data.slice(0, index), ...data.slice(index + 1)];
            this.setState({ data: newData });
          }
        } 
      });
  }

  render() {
   return(
     <>
     <Helmet>
       <title>Home</title>
     </Helmet>
     <div className="connectionMess">{this.state.errorMess}</div>
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
     <h1 className="mainH1">AvJS Lab 2 - Movie API</h1>
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
