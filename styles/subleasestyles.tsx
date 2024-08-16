import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  addressSuggestionItem: {
    padding: 10,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dateTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5, 
  },
  
  suggestionText: {
    fontSize: 14,
    color: 'white',
  },
  emptyStateContainer: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    height: 50,
  },
  header2: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 2, 
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: 'black',
  },
  emptyStateText: {
    fontSize: 14,
    color: 'gray',
  },
  loadingIndicator: {
    marginTop: 10,
    alignItems: 'center',
  },
  postItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  rightAction: {
    backgroundColor: '#2441D0',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leftAction: {
    backgroundColor: '#ff5252',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postContainer2: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    width: '100%',
  },
  content: {
    maxWidth: 393,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
  buttonOutline: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#f5f5f5',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonRight: {
    borderLeftWidth: 1,
    borderLeftColor: '#dcdcdc',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 13,
    letterSpacing: -0.02,
    textAlign: 'center',
  },
  activeButton: {
    backgroundColor: '#2441D0',
  },
  inactiveButton: {
    backgroundColor: 'transparent',
  },
  activeButtonText: {
    color: '#FFF',
  },
  inactiveButtonText: {
    color: '#000',
  },
  multiSelectContainer: {
    flex: 1,
    paddingTop: 20,
  },
  line: {
    height: 1,
    backgroundColor: '#dcdcdc',
    marginVertical: 16,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  friendshipcontentContainer: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  pickerForIOS: {
    flex: 1,
    color: 'gray',
    height: 60,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
  errorText2: {
    color: 'red',
    fontSize: 12,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 16,
    color: '#000',
  },
  AMformContainer: {
    marginBottom: 16,
  },
  AMformHeading: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: -0.01,
    textAlign: 'left',
    color: 'black',
    marginBottom: 4,
    marginTop: 15,
  },

  AMformlookHeading: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: -0.01,
    textAlign: 'left',
    color: 'black',
    marginBottom: 4,
    marginTop: 30,
  },

  AMstateformHeading: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: -0.01,
    textAlign: 'left',
    color: 'black',
    marginBottom: 4,
    marginTop: 35,
  },

  requiredAsterisk: {
    color: 'red',
  },
  ministyle: {
    fontSize: 12,
    color: 'gray',
  },
  AMinputContainer: {
    marginBottom: 16,
    height: 36,
  },
  AddressinputContainer: {
    marginBottom: 10,
    height: 36,
    marginTop: 10,
  },
  AddressinputContainercity: {
    height: 36,
  },
  AMinput: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000',
  },
  AMdescinputContainer: {
    marginBottom: 6,
    height: 300,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000',
    height: 300,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 36,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    height: 36,
    color: '#000',
  },
  calendarButton: {
    marginLeft: 8,
  },
  calendarIcon: {
    width: 20,
    height: 20,
  },
  submitButton: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },

  pickerselectcityContainer: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    marginTop: 10,
  },

  addresspickerselectcityContainer: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    marginTop: 10,
  },

  addresspickerselectstateContainer: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  pickercity: {
    flex: 1,
    color: 'gray',
    height: 60,
    paddingTop: 0,
    paddingBottom: 0,
  },

  pickerstate: {
    flex: 1,
    color: 'gray',
    height: 36,
  },

  slider: {
    width: '90%',
    alignSelf: 'center',
    height: 40,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2441D0',
  },
  rail: {
    flex: 1,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#d3d3d3',
  },
  railSelected: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2441D0',
  },

  uploadButton: {
    borderWidth: 2,
    backgroundColor: '#DEE3FF',
    borderColor: '#2441D0',
    borderStyle: 'dashed',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  uploadText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
  },
  uploadIcon: {
    width: 20,
    height: 20,
    tintColor: 'black',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
  },
  deleteIcon: {
    height: 18,
    width: 18,
    color: 'black',
    tintColor: 'black',
  },

  addressListItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },

  addressList: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  rangeLabelContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: '#2441D0',
    width: 90,
    borderRadius: 10,
    paddingVertical: 10,
  },

  rangeLabelText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sliderWrapper: {
    height: 50,
    justifyContent: 'center',
  },
  noPostsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'gray',
  },

  pickerstateForIOS: {
    flex: 1,
    color: 'gray',
  },

  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerContainerHome1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  pickerContainerFriend1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  pickerContainerHome2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  pickerContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    width: '100%', // Adjust width as needed
    height: 40, // Adjust height as needed
  },
  pickerWithIcon2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    width: '100%', // Adjust width as needed
    height: 40, // Adjust height as needed
    marginTop: 10,
    marginBottom: 10,
  },
  picker: {
    flex: 1, // Take up remaining space
    height: 36, // Adjust height as needed
    color: 'gray', // Text color
    fontSize: 16, // Font size
    paddingVertical: 0, // Remove default vertical padding
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },
});
