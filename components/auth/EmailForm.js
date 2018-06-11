import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet } from 'react-native';
import { Card, Icon, Text, Divider, Button } from 'react-native-elements';
import { actions as authActions } from '../../providers/auth';
import Colors from '../../constants/Colors';
import Messages from '../../constants/Messages';

const EmailForm = ({ actions, auth, handleFormChange, navigation }) => {
  const handleResendLink = () => {
    if (auth.currentUser) {
      actions.auth.sendEmailVerification();
    }
  };

  const handleEmailVerified = () => {
    if (auth.currentUser && auth.currentUser.emailVerified) {
      navigation.navigate('Main');
    }

    actions.auth.logout();
    handleFormChange();
  };

  const header = (
    <View>
      <View style={styles.headerContainer}>
        <Icon name="check-circle-o" color={Colors.primaryColorDark} size={25} type="font-awesome" />
        <Text style={styles.header}>{ Messages.emailVerificationTitle }</Text>
      </View>
      <Divider style={styles.divider} />
    </View>
  );

  const btnGradient = {
    colors: [Colors.accentColor, Colors.accentColorLight],
    start: [1, 0],
    end: [0.2, 0]
  };

  return (
    <View>
      <Card
        title={header}
        containerStyle={styles.container}
        dividerStyle={styles.divider}
      >
        <Text style={styles.text}>{ Messages.emailVerificationBody }</Text>
      </Card>
      <View style={styles.btnContainer}>
        <Button
          buttonStyle={styles.button}
          linearGradientProps={btnGradient}
          title="Resend link"
          titleStyle={styles.btnTitle}
          onPress={handleResendLink}
        />
        <Button
          buttonStyle={styles.button}
          linearGradientProps={btnGradient}
          title="Email verified"
          titleStyle={styles.btnTitle}
          onPress={handleEmailVerified}
        />
      </View>
    </View>
  );
};

EmailForm.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, .45)',
    borderRadius: 10,
    borderColor: Colors.primaryColorLight
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 18,
    marginLeft: 5
  },
  divider: {
    backgroundColor: Colors.white,
    marginVertical: 10
  },
  text: {
    color: Colors.black
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15
  },
  button: {
    borderRadius: 50,
    minWidth: 150
  },
  btnTitle: {
    fontSize: 14
  }
});

export default connect(null, (dispatch) => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch)
    }
  }
})(EmailForm);