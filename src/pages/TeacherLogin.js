import {StyleSheet, Text, View} from "react-native";
import React, {useState} from "react";
import {ButtonComp, Input, TextTitle} from "../components/Reuse";
import {COLORS} from "../styles/Colors";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase/firebase";
import {
	btnWrapper,
	passwordContainerStyle,
} from "../components/similarstyles/SimillarStyles";
import {InputComp} from "./StudentLogin";

const container = {
	flex: 1,
	flexDirection: "column",
	justifyContent: "space-evenly",
	paddingHorizontal: 20,
};

const btnTextStyle = {
	color: COLORS.white,
	fontSize: 16,
};
const bgColor = {
	backgroundColor: COLORS.brown,
	height: 40,
	width: "50%",
};

const TeacherLogin = ({navigation}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const gotoselectpage = async () => {
		if (!email || !password) {
			return alert("please email and password required!");
		}
		try {
			await signInWithEmailAndPassword(auth, email, password);
			alert("sign in succesfull");
			navigation.navigate("teacherselect", email);
		} catch (error) {
			return alert("invalid email and password");
		}
	};
	return (
		<View style={container}>
			<TextTitle />

			<View>
				<Text style={styles.loginText}>Teacher Login</Text>
				<InputComp
					placeholder="email"
					text="Email :"
					setValue={setEmail}
				/>
				<View style={passwordContainerStyle}>
					<InputComp
						placeholder="password"
						text="Password :"
						setValue={setPassword}
					/>
				</View>
				<View style={btnWrapper}>
					<ButtonComp
						text="Login"
						bgColor={bgColor}
						btnTextStyle={btnTextStyle}
						click={gotoselectpage}
					/>
				</View>
			</View>
		</View>
	);
};

export default TeacherLogin;

const styles = StyleSheet.create({
	loginText: {
		textAlign: "center",
		fontSize: 23,
		fontWeight: "700",
		marginBottom: 20,
	},
});
