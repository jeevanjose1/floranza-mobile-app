// toast-config.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseToast, ErrorToast, InfoToast, ToastConfigParams } from 'react-native-toast-message';

// Import this config in your _layout.tsx and pass it to Toast component
// <Toast config={toastConfig} />

const styles = StyleSheet.create({
  successToast: {
    backgroundColor: '#D1FAE5',
    height: 'auto',
    minHeight: 50,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    elevation: 1,
    borderLeftWidth:0,
  },
  errorToast: {
    backgroundColor: '#FEE2E2',
    height: 'auto',
    minHeight: 50,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    elevation: 1,
    borderLeftWidth:0,
    
  },
  infoToast: {
    backgroundColor: '#DBEAFE',
    
    height: 'auto',
    minHeight: 50,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    borderLeftWidth:0,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text1: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  text1Success: {
    color: '#059669',
  },
  text1Error: {
    color: '#DC2626',
  },
  text1Info: {
    color: '#2563EB',
  },
  text2: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  text2Success: {
    color: '#047857',
  },
  text2Error: {
    color: '#B91C1C',
  },
  text2Info: {
    color: '#1D4ED8',
  },
  successIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  errorIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  infoIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export const toastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={[styles.text1, styles.text1Success]}
      text2Style={[styles.text2, styles.text2Success]}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
      // renderLeadingIcon={() => (
      //   <View style={styles.successIconContainer}>
      //     <Text style={styles.icon}>✓</Text>
      //   </View>
      // )}
    />
  ),
  error: (props: ToastConfigParams<any>) => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={[styles.text1, styles.text1Error]}
      text2Style={[styles.text2, styles.text2Error]}
      text1NumberOfLines={2}
      text2NumberOfLines={2}
      // renderLeadingIcon={() => (
      //   <View style={styles.errorIconContainer}>
      //     <Text style={styles.icon}>✕</Text>
      //   </View>
      // )}
    />
  ),
  info: (props: ToastConfigParams<any>) => (
    <InfoToast
      {...props}
      style={styles.infoToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={[styles.text1, styles.text1Info]}
      text2Style={[styles.text2, styles.text2Info]}
      text1NumberOfLines={2}

      text2NumberOfLines={2}
      
      
    />
  ),
};