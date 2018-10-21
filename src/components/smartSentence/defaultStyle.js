 export default {
    control: {
      backgroundColor: '#fff',
      fontSize: 14,
      fontWeight: 'normal',
    },
  
    highlighter: {
      overflow: 'hidden',
    },
  
    input: {
      margin: 0,
    },
  
    '&multiLine': {
      control: {
        fontFamily: 'Fira Sans'
      },
  
      highlighter: {
        padding: 9,
      },
  
      input: {
        padding: 9,
        minHeight: 50,
        outline: 0,
        border: 0,
      },
    },
  
    suggestions: {
        list: {
          backgroundColor: 'white',
          border: '1px solid rgba(0,0,0,0.15)',
          fontSize: 12,

        },
  
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
  
        '&focused': {
          backgroundColor: '#cee4e5',
        },
      },
    },
  }