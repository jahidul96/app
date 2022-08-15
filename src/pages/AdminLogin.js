import {Image, StyleSheet, Text, View} from "react-native";
import React, {useState} from "react";
import {middleContentStyle} from "../components/similarstyles/SimillarStyles";
import {ButtonComp, Input} from "../components/Reuse";
import {COLORS} from "../styles/Colors";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase/firebase";

const lockImg = require("../../assets/images/lock.png");

const AdminLogin = ({navigation}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const bgColor = {
		backgroundColor: COLORS.brown,
		borderRadius: 5,
		width: "100%",
		marginTop: 10,
		height: 45,
	};
	const btnTextStyle = {
		color: "#fff",
		fontSize: 16,
	};

	const adminLogin = async () => {
		if (!email || !password) {
			return alert("please email and password required!");
		}
		try {
			await signInWithEmailAndPassword(auth, email, password);
			alert("sign in succesfull");
			navigation.navigate("admindashboard");
		} catch (error) {
			return alert("invalid email or password");
		}
	};
	return (
		<View style={middleContentStyle}>
			<View style={styles.imageWrapper}>
				<Image source={lockImg} style={styles.imgStyle} />
				<Text style={styles.text}>AdminLogin</Text>
			</View>
			<View>
				<Input placeholder="email" setValue={setEmail} />
				<Input placeholder="password" setValue={setPassword} />
				<ButtonComp
					bgColor={bgColor}
					btnTextStyle={btnTextStyle}
					text="Login"
					click={adminLogin}
				/>
			</View>
		</View>
	);
};

export default AdminLogin;

const styles = StyleSheet.create({
	imageWrapper: {
		alignItems: "center",
	},
	imgStyle: {
		width: 100,
		height: 100,
		borderRadius: 100 / 2,
	},
	text: {
		marginVertical: 10,
		fontSize: 20,
	},
});
