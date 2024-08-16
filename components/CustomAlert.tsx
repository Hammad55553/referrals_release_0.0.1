import React from 'react';
import {StyleSheet} from 'react-native';
import Dialog from 'react-native-dialog';

type AlertButton = {
  label: string;
  onPress: () => void;
};

type CustomAlertProps = {
  visible: boolean;
  title: string;
  description: string;
  buttons: AlertButton[];
  onClose: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  description,
  buttons,
  onClose,
}) => {
  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
      {buttons.map((button, index) => (
        <Dialog.Button
          key={index}
          label={button.label}
          onPress={() => {
            button.onPress();
            onClose();
          }}
        />
      ))}
    </Dialog.Container>
  );
};

export default CustomAlert;
