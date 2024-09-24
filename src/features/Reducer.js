const initialState = {
    單據: [],
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_單據_DATA':
      return {
        ...state,
        單據: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;