import React from 'react';

export default class PlayerContainer extends React.Component{

    state={
        playerMoney: 200,
        cardsDrawn: false,
        winningsCollected: false
    }

    call = () => {
        console.log(this.props.currentBet + " " + this.props.amountPaid)
        var amountToRemove = this.props.currentBet - this.props.amountPaid;
        if(amountToRemove < 5){
            amountToRemove=5;
        }
        this.setState(prevState => ({
            playerMoney: prevState.playerMoney-amountToRemove
        }))

        this.props.tookTurn(0);
        this.props.raise(0, this.props.amountPaid);

    }

    handleRaise = (amountToRaise) => {

        var amountToRemove = amountToRaise + this.props.currentBet;
        this.setState(prevState => ({
            previousBet: prevState.previousBet+this.props.currentBet,
            playerMoney: prevState.playerMoney-amountToRemove
        }))


        this.props.tookTurn(amountToRaise);
        this.props.raise(amountToRaise, this.props.amountPaid);
    }

    collectWinnings = () => {
        if(this.props.didIWin && !this.props.moneyCollected){
            this.setState(prevState => ({
                playerMoney: prevState.playerMoney+this.props.pot
            }))
        }
        this.props.collectMoney();
    }

    fold = () => {
        var self = this;
        self.props.fold();
    }


    render(){
        return(

            <div style={{color: 'white', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                <div className="col-1"
                     style={{maxWidth: '200px'}}>
                    {this.props.playerCards.map((cardImage, i) =>
                        <span key={i}>
									<img src={cardImage}/><br/>
								</span>
                    )}
                </div><br />
                Bank: ${this.state.playerMoney}

                <button className="button"
                        onClick={ () => this.call() }
                        disabled={(this.state.playerMoney < this.props.currentBet ||
                            !(this.props.myTurn)) ||
                        this.props.playerCards.length < 2 ||
                        this.props.winners.length > 0}>

                    Call: ${this.props.currentBet}

                </button>

                Raise:

                <button className="button"
                        onClick={ () => this.handleRaise(5) }
                        disabled={((this.state.playerMoney < this.props.currentBet + 5) ||
                            !(this.props.myTurn)) ||
                        this.props.playerCards.length < 2 ||
                        this.props.winners.length > 0}>
                    $5
                </button>

                <button className="button"
                        onClick={ () => this.handleRaise(10) }
                        disabled={((this.state.playerMoney < this.props.currentBet + 10) ||
                            !(this.props.myTurn)) ||
                        this.props.playerCards.length < 2 ||
                        this.props.winners.length > 0}>
                    $10
                </button>

                <button className="button"
                        onClick={ () => this.handleRaise(20) }
                        disabled={((this.state.playerMoney < this.props.currentBet + 20) ||
                            !(this.props.myTurn)) ||
                        this.props.playerCards.length < 2 ||
                        this.props.winners.length > 0}>
                    $20
                </button>
                {/*<button className="button"
                onClick={ () => this.drawHandCards(0) }
                disabled={this.state.cardsDrawn}>
            Draw cards
          </button><br />*/}
                <button className="button" onClick={ () => this.fold() } disabled={!this.props.myTurn || this.props.playerCards.length < 2 || this.props.winners.length > 0}>
                    Fold
                </button>
                <button className="button" onClick={ () => this.collectWinnings() } hidden={!(this.props.didIWin && !this.props.moneyCollected)}>
                    Collect Winnings!
                </button>
            </div>
        )
    }
}

