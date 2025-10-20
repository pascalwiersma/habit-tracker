import { useAuthHook } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const router = useRouter();

  const { signUp, signIn } = useAuthHook();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Graag alle velden invullen.");
      return;
    }

    if (password.length < 6) {
      setError("Wachtwoord moet minstens 6 tekens lang zijn.");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);

      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);

      if (error) {
        setError(error);
        return;
      }
    }

    router.replace("/");
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Account aanmaken" : "Welkom terug!"}
        </Text>

        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="mijn@email.com"
          mode="outlined"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          label="Wachtwoord"
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        <Button mode="contained" style={styles.button} onPress={handleAuth}>
          {isSignUp ? "Account aanmaken" : "Inloggen"}
        </Button>
        <Button
          mode="text"
          style={styles.switchModeButton}
          onPress={handleSwitchMode}
        >
          {isSignUp ? "Al een account? Inloggen" : "Nog geen account? Aanmaken"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
