import React from "react";
import classes from "./index.module.css";
import Button from "../../components/UI/Button/";
import {
	createControl,
	validateForm,
	setControl,
} from "../../form/formFramework";
import Input from "../../components/UI/Input/";
import Select from "../../components/UI/Select/";
import axios from '../../utils/axios';

const createOptionControl = (number) =>
	createControl(
		{
			id: number,
			label: `Вопрос ${number}`,
			errorMessage: "Вопрос не может быть пустым",
		},
		{ required: true }
	);

const createFormControls = () => ({
	question: createControl(
		{
			label: "Введите вопрос",
			errorMessage: "Вопрос не может быть пустым",
		},
		{ required: true }
	),
	option1: createOptionControl(1),
	option2: createOptionControl(2),
	option3: createOptionControl(3),
	option4: createOptionControl(4),
});

export default class extends React.Component {
	state = {
		quiz: [],
		rightAnswerId: 1,
		isFormValid: false,
		formControls: createFormControls(),
	};

	submitHandler = (event) => {
		event.preventDefault();
	};

	addQuestionHandler = (event) => {
		event.preventDefault();

		const quiz = [...this.state.quiz];
		const index = quiz.length + 1;

		const {
			question,
			option1,
			option2,
			option3,
			option4,
		} = this.state.formControls;

		const questionItem = {
			question: question.value,
			id: index,
			rightAnswerId: this.state.rightAnswerId,
			answers: [
				{ text: option1.value, value: option1.id },
				{ text: option2.value, value: option2.id },
				{ text: option3.value, value: option3.id },
				{ text: option4.value, value: option4.id },
			],
		};

		quiz.push(questionItem);

		this.setState({
			quiz,
			rightAnswerId: 1,
			isFormValid: false,
			formControls: createFormControls(),
		});
	};

	createQuizHandler = async (event) => {
		event.preventDefault();
		try {
			await axios.post("quiz/create", {
				quizes: this.state.quiz,
			});

			this.setState({
				quiz: [],
				rightAnswerId: 1,
				isFormValid: false,
				formControls: createFormControls(),
			});
		} catch (e) {
			console.log(e.response.data);
		}
	};

	onChangeHandler = (value, controlName) => {
		const formControls = {
			...this.state.formControls,
			[controlName]: setControl(value, {
				...this.state.formControls[controlName],
			}),
		};
		this.setState({
			formControls,
			isFormValid: validateForm(formControls),
		});
	};

	renderControls() {
		return Object.entries(this.state.formControls).map(
			(
				[
					controlName,
					{ id, label, value, errorMessage, valid, touched, validation },
				],
				index
			) => {
				return (
					<React.Fragment key={index}>
						<Input
							label={label}
							value={value}
							errorMessage={errorMessage}
							valid={valid}
							touched={touched}
							shouldValidate={Boolean(validation)}
							onChange={(event) =>
								this.onChangeHandler(event.target.value, controlName)
							}
						/>

						{index === 0 ? <hr /> : null}
					</React.Fragment>
				);
			}
		);
	}

	selectChangeHandler = (event) => {
		this.setState({
			rightAnswerId: Number(event.target.value),
		});
	};

	render() {
		return (
			<div className={classes.quizCreator}>
				<div>
					<h1>Создание теста</h1>

					<form onSubmit={this.submitHandler}>
						{this.renderControls()}

						<Select
							label="Выберите правильный ответ"
							value={this.state.rightAnswerId}
							onChange={this.selectChangeHandler}
							options={[
								{ text: 1, value: 1 },
								{ text: 2, value: 2 },
								{ text: 3, value: 3 },
								{ text: 4, value: 4 },
							]}
						/>

						<Button
							type="primary"
							onClick={this.addQuestionHandler}
							disabled={!this.state.isFormValid}
						>
							Добавить вопрос
						</Button>
						<Button
							type="success"
							onClick={this.createQuizHandler}
							disabled={this.state.quiz.length === 0}
						>
							Создать тест
						</Button>
					</form>
				</div>
			</div>
		);
	}
}
