import React from "react";
import "./App.css";

const initState = {
	maxScore: localStorage.getItem("max-score") || 0,
	currentScore: 0,
	my_dot: {
		left: 45,
		top: 45
	},
	enemy_dot: [
		{
			left: 95,
			top: 35,
			direct: 37
		},
		{
			left: 35,
			top: 35,
			direct: 40
		}
	],
	amount: 3
};

class App extends React.Component {
	constructor() {
		super();
		this.state = initState;
	}

	componentDidMount() {
		setInterval(this.onEnemyAutoMove, 100);
		setInterval(this.onGenerateEnemy, 1000);
	}
	componentDidUpdate() {
		this.gameOver();
	}
	gameOver = () => {
		var { enemy_dot, my_dot } = this.state;
		enemy_dot.forEach((item) => {
			var { left, top, direct } = item;
			if (
				direct === 37 &&
				left - my_dot.left <= 4 &&
				left - my_dot.left >= 0 &&
				top === my_dot.top
			) {
				this.setState(initState);
				alert("Game over");
			} else if (
				direct === 38 &&
				top - my_dot.top <= 4 &&
				top - my_dot.top >= 0 &&
				left === my_dot.left
			) {
				this.setState(initState);
				alert("Game over");
			}
			if (
				direct === 39 &&
				my_dot.left - left <= 4 &&
				my_dot.left - left >= 0 &&
				top === my_dot.top
			) {
				this.setState(initState);
				alert("Game over");
			}
			if (
				direct === 40 &&
				my_dot.top - top <= 4 &&
				my_dot.top - top >= 0 &&
				left === my_dot.left
			) {
				this.setState(initState);
				alert("Game over");
			}
		});
	};
	onGenerateEnemy = () => {
		var { direct, left, top } = this.state.my_dot;
		direct = Math.floor(Math.random() * 4) + 37;
		if (direct === 37) left = 95;
		else if (direct === 38) top = 95;
		else if (direct === 39) left = 0;
		else if (direct === 40) top = 0;
		this.setState({
			enemy_dot: [...this.state.enemy_dot, { left, top, direct }]
		});
	};
	onShowEnemy(enemy_dot) {
		var enemy_ele = enemy_dot.map((item, index) => {
			var style = {
				left: item.left + "%",
				top: item.top + "%"
			};
			return <span className="enemy-dot dot" key={index} style={style}></span>;
		});
		return enemy_ele;
	}
	onEnemyAutoMove = () => {
		var { enemy_dot, currentScore, maxScore } = this.state;
		var indexRemoveEnemy = -1;
		enemy_dot = enemy_dot.map((item, index) => {
			var { left, top, direct } = item;
			if (direct === 37) {
				left = left - 1;
			} else if (direct === 38) {
				top = top - 1;
			} else if (direct === 39) {
				left = left + 1;
			} else if (direct === 40) {
				top = top + 1;
			}
			if (left < 0 || left > 95 || top < 0 || top > 95) {
				indexRemoveEnemy = index;
			}
			return { left, top, direct };
		});
		if (indexRemoveEnemy > -1) {
			currentScore++;
			if (currentScore > maxScore) {
				maxScore = currentScore;
				localStorage.setItem("max-score", this.state.maxScore);
			}
			enemy_dot.splice(indexRemoveEnemy, 1);
		}
		this.setState({
			maxScore,
			currentScore,
			enemy_dot
		});
	};

	onMove = (event) => {
		var { my_dot } = this.state;
		if (event.keyCode === 37) {
			my_dot.left = my_dot.left - 5;
		} else if (event.keyCode === 38) {
			my_dot.top = my_dot.top - 5;
		} else if (event.keyCode === 39) {
			my_dot.left = my_dot.left + 5;
		} else if (event.keyCode === 40) {
			my_dot.top = my_dot.top + 5;
		}
		my_dot = this.overBoard(my_dot).dot;
		this.setState({
			my_dot
		});
	};
	overBoard(dot) {
		var isOver = false;
		if (dot.left >= 95) {
			dot.left = 95;
			isOver = true;
		}
		if (dot.left < 0) {
			dot.left = 0;
			isOver = true;
		}
		if (dot.top >= 95) {
			dot.top = 95;
			isOver = true;
		}
		if (dot.top < 0) {
			dot.top = 0;
			isOver = true;
		}
		return { dot, isOver };
	}
	render() {
		var { my_dot } = this.state;
		var style = {
			left: `${my_dot.left}%`,
			top: `${my_dot.top}%`
		};
		var enemy_ele = this.onShowEnemy(this.state.enemy_dot);
		return (
			<div className="App" onKeyDown={this.onMove} tabIndex="0">
				<h1 className="title">Avoid game</h1>
				<h3 className="max-score">MAX SCORE: {this.state.maxScore}</h3>
				<h3 className="score">SCORE: {this.state.currentScore}</h3>
				<div className="board">
					<span className="dot my-dot" style={style}></span>
					{enemy_ele}
				</div>
			</div>
		);
	}
}

export default App;
