import {
    StyleSheet,
    TextProps,
    TouchableOpacity,
    Text,
    ActivityIndicator,
  } from 'react-native';
  import {ReactNode} from 'react';
  import {useSelector} from 'react-redux';
  import {RootState} from '../redux/reducers';
  
  export type ThemedTextProps = TextProps & {
    label?: string | ReactNode;
    onPress?: () => void;
  };
  
  export function PostButton({label, onPress}: ThemedTextProps) {
    const loading: boolean = useSelector(
      (state: RootState) => state.auth.loading,
    );
  
    return (
      <TouchableOpacity
        disabled={loading}
        style={styles.button}
        onPress={onPress}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.text}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  }
  
  const styles = StyleSheet.create({
    button: {
      backgroundColor: '#2441D0',
      height: 46,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 25,
    },
    text: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  