import React, { Component } from 'react';
import Downshift from 'downshift';
import './styles/css/App.css';
import {TiGroupOutline} from 'react-icons/ti';
import {MdClose} from 'react-icons/md';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import MatchSorter from 'match-sorter'

import ClickOutHandler from 'react-onclickout';

import ListItem from './ListItem';


import dummyData from './assets/data.json';


const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
  });

  const customBtn = {
    color:'#007672',
    background:'#e2f4ea',
    margin:'10px'
 };

 const activeStyle = {
    background:'#e2f4ea'
 }

let getLocalStorage='';

class AddTeamMate extends React.Component {
    allItems = dummyData.map(s => ({id: s.id, username: s.username, role:s.role, picture:s.picture}))

    state = {
        items: this.allItems,
        isOpen: '',
        selectedItem:'',
        inputValue:'',
        error: false,
        errorMessage:'',
        selectedTeam:[],
        updateCache: false,
        isHidden:true,
        clickedOutSide: false,
        addClass:false
    }

    componentDidMount = () => {
        getLocalStorage = JSON.parse(sessionStorage.getItem("cacheselectedTeam"));
        if(getLocalStorage != null && this.state.selectedTeam.length === 0){
            this.setState({
                selectedTeam:getLocalStorage
            })
        }
        else{
            this.setState({
                selectedTeam:[]
            })
        }
    };

    componentDidUpdate = () => {
        if(this.state.updateCache){
            getLocalStorage = JSON.parse(sessionStorage.getItem("cacheselectedTeam"));
        }
    };

    handleStateChange = (changes, downshiftState) => {
        if (changes.hasOwnProperty('selectedItem')) {
            this.setState({
                selectedItem:changes.selectedItem,
            },() =>{
                this.addTeamMember(this.state.selectedItem);
            })
        }
       
        if (changes.hasOwnProperty('inputValue') && changes.type == "__autocomplete_change_input__") {
           
            this.setState({
                items: this.getItems(changes.inputValue),
                inputValue:changes.inputValue,
                error:false
            }, () => {
                this.validateInputChange (changes.inputValue);
            })

        }

    };

    handleChange = (selectedItem, downshiftState) => {
        this.setState({
            items: this.allItems,
        })
    }

    validateInputChange = (value) => {
        let data = "<div class='error-msg'><p class='err-title'>Team member not found </p><p class='err-body'>Maybe he/she is not yet in your <span class='underline'>team</span> ?</p></div>"
        const danger_dom = <div dangerouslySetInnerHTML={{__html: data}}/>
        
        let resultObject =  this.allItems.filter((userData) => {
            
            if (userData.username.toLowerCase().includes(value.toLowerCase())) {
                return userData
            }
        });

        if (!resultObject.length) {
            this.setState({
                error: true,
                errorMessage:danger_dom
            })
        }

    };

    toggleIsHidden = () => {
        this.setState({
            isHidden:!this.state.isHidden,
            addClass:!this.state.addClass
        })
    };

    getItems = (value) => {
        return value ?  MatchSorter(this.allItems, value,{
            keys:['username'],
        }) : this.allItems;
    }

    onClickOut = e => {
        this.setState({
            isHidden:true,
            inputValue:'',
            error:false,
            addClass:false
        })
    };

    clearSelection = () => {
        let inputValue = this.state.inputValue;
        if(inputValue != null || inputValue != ""){
            this.setState({
                inputValue: "",
                error:false,
                errorMessage:''
            })
        }
    }; 

    addTeamMember = () => {
        const {selectedItem} = this.state;
        const danger_domp = <div className="err-exist" dangerouslySetInnerHTML={{__html: selectedItem.username + " already exist"}}/>
        if(selectedItem != null){
            if(this.checkMemberExists(selectedItem)){
                this.setState({
                    error: true,
                    errorMessage:danger_domp
                })
            }
            else{
                this.addTeamMemberCache(selectedItem);
                this.setState({
                    isOpen:true,
                    error:false,
                    errorMessage:''
                })
            }
        }
    };

    addTeamMemberCache = (selectedItem) => {
         this.state.selectedTeam.push(selectedItem)
         sessionStorage.setItem("cacheselectedTeam", JSON.stringify(this.state.selectedTeam));
         this.setState({
             updateCache:true,
         })
         
    };

    checkMemberExists = (members) => {
        var id = members.id;
        if(id){
            return this.state.selectedTeam.some(function(el) {
                return el.id === id;
            }); 
        }
        else{
            return id;
        }
    };
  
    render() {
        const headerTitle = "YOUR TEAM FOR THIS TEST";
        const { classes } = this.props;
        const { selectedItem } = this.state;
        let classActive = ["icon-group"];

        if(this.state.addClass){
            classActive.push('green')
        }

        return (
           <ClickOutHandler onClickOut={this.onClickOut}>
            <div className="content" >

                <div className="header">
                    <div className="header-title">{headerTitle}</div>
                    <div  className={classActive.join(' ')}><TiGroupOutline/></div>
                </div>

                <div className="dropdown-wrap">
                
                    <a href="#" className="btn toggle-btn" onClick={this.toggleIsHidden.bind(this)}>
                    <Button variant="fab" color="primary"  aria-label="Add" className={classes.button} style={customBtn}>
                        <AddIcon />
                    </Button>
                        <div className="btn-text">Add team members for this test</div>
                    </a>

                    {!this.state.isHidden && 
                    <Downshift 
                        selectedItem={selectedItem}
                        onStateChange={this.handleStateChange}
                        onChange={this.handleChange}
                        items={this.state.items}
                        itemToString={selectedItem => (selectedItem == "" ? '' : String(selectedItem.username))}
                        >
                        {({ 
                            getInputProps, 
                            getItemProps,
                            isOpen,
                            inputValue,
                            highlightedIndex,
                            selectedItem,
                            getMenuProps
                            }) => (
                            
                            <div className="row list-wrap" >
                                <input {...getInputProps({placeholder:"Client"}) }   value={this.state.inputValue}   
                                className="input search-box" />

                                    <div className="btn icon-clear">
                                        <MdClose onClick={this.clearSelection}/>
                                    </div>

                                    <div {...getMenuProps()} className="list-result">
                                    {
                                    isOpen  ? (
                                        
                                        <div>
                                            {  
                                               this.state.items.map((item, id)=>
                                                <div className="dropdown-item" {...getItemProps({ key: item.id, item })}
                                                    style={{
                                                    backgroundColor: highlightedIndex === id ? '#e2f4ea' : 'white',
                                                    fontWeight: selectedItem === item ? 'bold' : 'normal',}}>
                                                    <div className="list-items">
                                                        <img src={require(`../src/assets/${item.picture}`)} className="icon-member"/>
                                                        <div className="item-users">{item.username}</div>
                                                    </div>
                                                    
                                                </div>
                                                    
                                                )}
                                                
                                            </div>
                                        ) :
                                    null 
                                    }
                                </div>
                            </div>
                            )}

                    </Downshift>
                    }

            </div>
            
            {/* added team list */}
            { this.state.selectedTeam.length > 0 
                && 
                <ListItem list={this.state.selectedTeam}/>
            }
            {/* error tab */}
            { this.state.error && this.state.errorMessage}

            
            </div>
        </ClickOutHandler>
        )
    }
}

export default withStyles(styles)(AddTeamMate);