import React from 'react';
import PlayerContainer from './PlayerContainer';
import $ from 'jquery';
import Clock from './Clock'

const DrawButton = (props) => {

    return (
        <button className="button" disabled={props.cards.length > 1} onClick={ props.drawCards }>Draw cards!</button>
    )
}

const CheckButton = (props) => {
    return (
        <button className="button"
                disabled={((props.cards.length<5) || (props.player1<2) || (props.player2<2)) || (props.winners.length > 0)}
                onClick={props.checkHand7}>
            find the best hand
        </button>
    )
}

const RestartButton = (props) => {
    return (
        <button className="button"
                disabled={props.winners.length < 1}
                onClick={ props.restartGame }>
            Deal Next Hand!
        </button>
    )
}

const CardContainer = (props) =>{
    return(
        <div className="col-5"
             style={{float: 'left', maxWidth: '500px', position:'fixed', top:'140px', left: '500px'}}>
            {props.cards.map((cardImage, i) =>
                <span key={i}>
					<img src={cardImage} /><br />
				</span>
            )}
        </div>
    )
}


const WinnerContainer = (props) => {
    return(
        <div style={{float: 'left', maxWidth: '500px', position:'fixed', top:'360px', left: '600px'}}>
            {props.winners.map((winner, i) =>
                <span key={i}>
					{winner}
				</span>
            )}
            <br />
        </div>
    )
}

const PotContainer = (props) => {
    return(
        <div style={{float: 'left',  position:'fixed', top:'21px', left: '500px'}} >
            Pot: ${props.pot}
        </div>
    )
}



export default class PokerApp extends React.Component{

    constructor(){
        super()
        this.state = {
            cards: [],
            cardImage: [],
            winners: [],
            pot: 0,
            currentBet: 5,
            previousBet: 0,
            player1: [],
            player1Image: [],
            player2: [],
            player2Image: [],
            player1Turn: true,
            player2Turn: false,
            player1Wins: false,
            player2Wins: false,
            has2Raised: false,
            moneyCollected: false,
            amountPaidBy1: 0,
            amountPaidBy2: 0

        };
    }
    drawHandCards = () => {
        console.log("Draw");
        var self = this;
        $.get("http://localhost:8080/api/v1/drawCard",
            function (data) {
                self.setState(prevState => ({
                    player1Image: prevState.player1Image.concat("./cards/" + data + ".svg"),
                    player1: prevState.player1.concat(data)}))
            }
        )
        $.get("http://localhost:8080/api/v1/drawCard",
            function (data) {
                self.setState(prevState => ({
                    player1Image: prevState.player1Image.concat("./cards/" + data + ".svg"),
                    player1: prevState.player1.concat(data)}))
            }
        )
        $.get("http://localhost:8080/api/v1/drawCard",
            function (data) {
                self.setState(prevState => ({
                    player2Image: prevState.player2Image.concat("./cards/" + data + ".svg"),
                    player2: prevState.player2.concat(data)}))
            }
        )
        $.get("http://localhost:8080/api/v1/drawCard",
            function (data) {
                self.setState(prevState => ({
                    player2Image: prevState.player2Image.concat("./cards/" + data + ".svg"),
                    player2: prevState.player2.concat(data)}))
            }
        )
    }

    player1Bet = (amountToRaise) => {
        var self = this;
        self.setState(prevState => ({
            player1Turn: false,
            player2Turn: true,
            amountPaidBy1: prevState.amountPaidBy1 + prevState.currentBet + amountToRaise
        }))
        if(this.state.has2Raised && amountToRaise == 0){
            if(this.state.cards.length < 3 & amountToRaise === 0){
                self.setState(prevState => ({
                    player2Turn: false,
                    player1Turn: true,
                    has2Raised: false,
                    previousBet: 0,
                    amountPaidBy1: 0,
                    amountPaidBy2: 0

                }))
                this.drawCard();
                this.drawCard();
                this.drawCard();
            }
            else if (this.state.cards.length < 5 & amountToRaise === 0){
                self.setState(prevState => ({
                    player2Turn: false,
                    player1Turn: true,
                    has2Raised: false,
                    previousBet: 0,
                    amountPaidBy1: 0,
                    amountPaidBy2: 0

                }))
                this.drawCard();
            }
            else if(amountToRaise === 0){
                self.setState(prevState => ({
                    player2Turn: false,
                    player1Turn: true,
                    has2Raised: false,
                    amountPaidBy1: 0,
                    amountPaidBy2: 0

                }))
                this.checkHand7();
                self.setState(prevState => ({
                    previousBet: 0,
                    amountPaidBy1: 0,
                    amountPaidBy2: 0

                }))
            }
        }
    }

    player2Bet = (amountToRaise) => {
        var self = this;
        self.setState(prevState => ({
            player2Turn: false,
            player1Turn: true,
            amountPaidBy2: prevState.amountPaidBy2 + prevState.currentBet + amountToRaise

        }))
        if(amountToRaise > 0){
            self.setState(prevState => ({
                has2Raised: true,
                previousBet: 0
            }))
        }
        if(this.state.cards.length < 3 & amountToRaise === 0){
            this.drawCard();
            this.drawCard();
            this.drawCard();
            self.setState(prevState => ({
                previousBet: 0,
                amountPaidBy2: 0,
                amountPaidBy1: 0

            }))
        }
        else if (this.state.cards.length < 5 & amountToRaise === 0){
            this.drawCard();
            self.setState(prevState => ({
                previousBet: 0,
                amountPaidBy2: 0,
                amountPaidBy1: 0

            }))
        }
        else if(amountToRaise === 0){
            this.checkHand7();
            self.setState(prevState => ({
                previousBet: 0,
                amountPaidBy2: 0,
                amountPaidBy1: 0

            }))
        }
    }

    addMoneyToPot = (amountToRaise, amountPaid) => {
        var self = this;
        self.setState(prevState => ({
            currentBet: prevState.currentBet + amountToRaise
        }))
        if(amountToRaise > 0){

            self.setState(prevState => ({
                pot: prevState.pot + prevState.currentBet - amountPaid,
            }))

            self.setState(prevState => ({
                previousBet: prevState.previousBet + this.state.currentBet
            }))

        }
        else {
            self.setState(prevState => ({
                pot: prevState.pot + prevState.currentBet - amountPaid
            }))
        }
    }

    drawCard = () => {
        var self = this;

        $.get("http://localhost:8080/api/v1/drawCard",
            function (data) {
                self.setState(prevState => ({
                    cardImage: prevState.cardImage.concat("./cards/" + data + ".svg"),
                    cards: prevState.cards.concat(data),
                    currentBet: 5
                }))
            }
        )};

    checkHand = () => {
        var self = this;
        var handToCheck = self.state.cards.slice(-5);

        $.get("http://localhost:8080/api/v1/checkHand/"+handToCheck,
            function(data){
                self.setState(prevState => ({winners: prevState.winners.concat(data)}))
            })
    };

    checkHand7 = () => {
        var self = this;

        var pool = self.state.cards.slice(-5);
        var hand1 = self.state.player1;
        var hand2 = self.state.player2;


        $.get("http://localhost:8080/api/v1/compare7/"+pool+"/"+hand1+"/"+hand2,
            function(data){
                self.setState(prevState => ({winners: prevState.winners.concat(data)}))
                if(data.indexOf("Player one") > -1){
                    self.setState({player1Wins: true})
                }
                else if (data.indexOf("Player two") > -1){
                    self.setState({player2Wins: true})
                }

            })


    };

    restartGame = () => {
        console.log("reset stuffs");
        var self=this;
        self.setState(	{cards: [],
            cardImage: [],
            winners: [],
            pot: 0,
            currentBet: 5,
            player1: [],
            player1Image: [],
            player2: [],
            player2Image: [],
            player1Wins: false,
            player2Wins: false,
            moneyCollected: false,
            amountPaidBy1: 0,
            amountPaidBy2: 0}
        );
        $.get("http://localhost:8080/api/v1/shuffleDeck");
    };

    foldPlayer1 = () => {
        var self = this;
        self.setState(prevState => ({winners: prevState.winners.concat("Player two wins!")}))
    };

    foldPlayer2 = () => {
        var self = this;
        self.setState(prevState => ({winners: prevState.winners.concat("Player one wins!")}))
    };
    collectMoney = () => {
        var self = this;
        self.setState(prevState => ({moneyCollected: true}))
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <DrawButton drawCards={this.drawHandCards}
                                cards={this.state.player1}/>

                    <CheckButton cards={this.state.cards}
                                 checkHand={this.checkHand}
                                 checkHand7={this.checkHand7}
                                 player1={this.state.player1}
                                 player2={this.state.player2}
                                 winners={this.state.winners}/>

                    <RestartButton restartGame={this.restartGame}
                                   winners={this.state.winners}/>
                    <Clock/>
                    <PotContainer pot={this.state.pot} />

                    <CardContainer cards={this.state.cardImage} />
                    <div style={{color: 'white', float: 'right',   position: 'fixed', top: 50, right: 25, textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'}}>
                        <strong><WinnerContainer winners={this.state.winners} /></strong>
                    </div>
                </div>
                <br />
                <div>
                    <div style={{float: 'left',   position: 'fixed', bottom: 200, left: 260}}>

                        <PlayerContainer playerMoney={this.state.playerMoney1}
                                         currentBet={this.state.currentBet}
                                         previousBet={this.state.previousBet}
                                         raise={this.addMoneyToPot}
                                         playerCards={this.state.player1Image}
                                         winners={this.state.winners}
                                         fold={this.foldPlayer1}
                                         myTurn={this.state.player1Turn}
                                         tookTurn={this.player1Bet}
                                         pot={this.state.pot}
                                         didIWin={this.state.player1Wins}
                                         moneyCollected={this.state.moneyCollected}
                                         collectMoney={this.collectMoney}
                                         amountPaid={this.state.amountPaidBy1}/>
                    </div>
                    <div style={{float: 'right',   position: 'fixed', bottom: 200, right: 260}}>
                        <PlayerContainer playerMoney={this.state.playerMoney2}
                                         currentBet={this.state.currentBet}
                                         previousBet={this.state.previousBet}
                                         raise={this.addMoneyToPot}
                                         playerCards={this.state.player2Image}
                                         winners={this.state.winners}
                                         fold={this.foldPlayer2}
                                         myTurn={this.state.player2Turn}
                                         tookTurn={this.player2Bet}
                                         pot={this.state.pot}
                                         didIWin={this.state.player2Wins}
                                         moneyCollected={this.state.moneyCollected}
                                         collectMoney={this.collectMoney}
                                         amountPaid={this.state.amountPaidBy2}/>
                    </div>

                </div>
            </div>
        );
    }
}
