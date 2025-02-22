import React from "react";
import classes from "./index.module.css";
import Button from "../../components/UI/Button/";
import Input from "../../components/UI/Input/";
import {
	createControl,
	validateForm,
	setControl,
} from "../../form/formFramework";
import axios from "../../utils/axios";
import Loader from "../../components/UI/loader";

const createFormControls = () => ({
	email: createControl(
		{
			type: "email",
			label: "Email",
			errorMessage: "Введите корректный email",
		},
		{
			required: true,
			email: true,
		}
	),
	password: createControl(
		{
			type: "password",
			label: "Пароль",
			errorMessage: "Введите корректный пароль",
		},
		{
			required: true,
			minLength: 6,
		}
	),
});

export default class extends React.Component {
	state = {
		isFormValid: false,
		loading: false,
		formControls: createFormControls(),
	};

	loginHandler = async () => {
		try {
			this.setState({ loading: true });

			await axios.post("/auth/login", {
				email: this.state.formControls.email.value,
				password: this.state.formControls.password.value,
			});

			this.setState({
				isFormValid: false,
				loading: false,
				formControls: createFormControls(),
			});
		} catch (e) {
			console.log(e.response.data);
			this.setState({ loading: false });
		}
	};

	registerHandler = async () => {
		try {
			this.setState({
				loading: true,
			});

			await axios.post("/auth/register", {
				email: this.state.formControls.email.value,
				password: this.state.formControls.password.value,
			});

			this.setState({
				isFormValid: false,
				loading: false,
				formControls: createFormControls(),
			});
		} catch (e) {
			console.log(e.response.data);
		}
	};

	/* submitHandler = (event) => {
		event.preventDafault();
	}; */

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

	renderInputs() {
		return Object.entries(this.state.formControls).map(
			(
				[
					controlName,
					{ type, label, value, errorMessage, valid, touched, validation },
				],
				index
			) => {
				return (
					<Input
						key={controlName + index}
						type={type}
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
				);
			}
		);
	}

	render() {
		return (
			<div className={classes.auth}>
				<div>
					<h1>Авторизация</h1>
					{this.state.loading ? (
						<Loader />
					) : (
						<div className={classes.authForm}>
							{this.renderInputs()}

							<Button
								type="success"
								onClick={this.loginHandler}
								disabled={!this.state.isFormValid}
							>
								Войти
							</Button>
							<Button
								type="primary"
								onClick={this.registerHandler}
								disabled={!this.state.isFormValid}
							>
								Зарегистрироваться
							</Button>
						</div>
					)}
				</div>
			</div>
		);
	}
}
