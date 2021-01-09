import React from 'react';
import './Dashboard.css';
import Carousel from 'react-material-ui-carousel'
import {Paper , Avatar} from '@material-ui/core'


function Dashboard() {
    var items = [
        {
            img : "Images/Teacher/Card1.jpg"
        },
        {
            img : "Images/Teacher/Card2.png"
        },
        {
            img : "Images/Teacher/Card3.png"
        },
        {
            img : "Images/Teacher/Card4.jpg"
        },
        {
            img : "Images/Teacher/Card5.jpg"
        }
    ];
    
    return (
        <div className="dashboard">
            <div className="slider">
                    <Carousel  navButtonsAlwaysVisible="true" animation="slide">
                        {
                            items.map( (item, i) => {
                                return (  
                                    <Paper>
                                        <div className="slides">
                                            <img src={item.img} className="slider__img" />
                                        </div>
                                    </Paper>
                                )
                            })
                        }
                    </Carousel>
            </div>
        </div>
    )
}

export default Dashboard
