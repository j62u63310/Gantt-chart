const initialState = {
    單據: [],
    組合: [],
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_單據_DATA':
      return {
        ...state,
        單據: action.payload,
      };
    case 'SET_組合_DATA':
      return {
        ...state,
        組合: action.payload,
      }
    default:
      return state;
  }
};

export default Reducer;