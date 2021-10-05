import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Text } from 'react-native-elements';
import { RFPercentage } from 'react-native-responsive-fontsize';
import moment from 'moment';
import InlineIcon from '../components/InlineIcon';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {
  checkDisplayStatus,
  checkDisplayStatuses,
} from '../helpers/checkDisplayHistory';

const now = moment();

const getDisplayDate = (rawDate) => {
  return (
    (rawDate && moment(rawDate, 'DD/MM/YYYY hh:mm:ss').format('Do MMM YYYY')) ||
    ''
  );
};

const getItemStatus = (startDate, expiryDate) => {
  let theFromDate = null;
  let theToDate = null;
  let ageOfExpiry = 0;
  let ageOfStart = 0;

  if (expiryDate && expiryDate.length > 0) {
    theToDate = moment(expiryDate, 'DD/MM/YYYY HH:mm:ss');
    ageOfExpiry = (now && now.diff(moment(theToDate), 'days')) || 0;
  }
  //   console.log('ageOfExpiry', ageOfExpiry);

  if (ageOfExpiry >= 1) {
    return false;
  } else {
    if (startDate && startDate.length > 0) {
      theFromDate = moment(startDate, 'DD/MM/YYYY HH:mm:ss');
      ageOfStart = (now && now.diff(moment(theFromDate), 'days')) || 0;
      //   console.log('ageOfStart', ageOfStart);
    }

    if (ageOfStart >= 0) {
      return true;
    }
  }
  return false;
};

export default function ServiceMeasuresList(props) {
  const windowDim = useWindowDimensions();
  const baseStyles = windowDim && getBaseStyles(windowDim);

  const { showFullDetails, items, displayTimestamp } = props;

  const serviceMeasures = items || [];
  //   const serviceMeasures = serviceMeasuresDummyData;
  //   let now = moment();

  console.log('displayTimestamp passed in is ', displayTimestamp);

  checkDisplayStatuses(items);

  const getFormattedServiceMeasure = (item) => {
    let measureIsLive = false;
    const isUnseen = checkDisplayStatus(item.dateCreated, displayTimestamp);
    if (item && item.dateCreated && item.expiryDate) {
      measureIsLive = getItemStatus(item.dateCreated, item.expiryDate);
    }

    return (
      <View style={baseStyles.containerNoMargin}>
        <View>
          <Text
            style={baseStyles.textLeftAlignedBoldLarge}
          >{`${item.menuText}`}</Text>
        </View>
        {showFullDetails && showFullDetails === true ? (
          <View
            style={{
              ...baseStyles.viewRowFlexCentreAligned,
              marginTop: 5,
            }}
          >
            <InlineIcon
              itemType='font-awesome'
              iconName={measureIsLive ? 'calendar-check' : 'calendar-times'}
              iconSize={RFPercentage(2.4)}
              iconColor={
                //item.status && item.status.toLowerCase() === 'c'
                measureIsLive ? Colors.vwgKhaki : Colors.vwgWarmRed
              }
            />
            <Text
              style={{ ...baseStyles.textLeftAligned, paddingLeft: 7 }}
            >{`Service measure ${
              //item.status && item.status.toLowerCase() === 'c'
              measureIsLive ? 'still open' : 'closed'
            }`}</Text>

            {!isUnseen ? (
              <Text
                style={{
                  ...baseStyles.textLeftAlignedBoldLarge,
                  color: Colors.vwgCoolOrange,
                }}
              >{` NEW! `}</Text>
            ) : null}
          </View>
        ) : null}
        <View style={baseStyles.viewRowFlexCentreAligned}>
          <InlineIcon
            itemType='font-awesome'
            iconName={item.retailerStatus ? 'praying-hands' : 'hands'}
            iconSize={RFPercentage(2)}
            iconColor={
              item.retailerStatus ? Colors.vwgKhaki : Colors.vwgWarmRed
            }
          />
          <Text
            style={{ ...baseStyles.textLeftAligned, paddingLeft: 5 }}
          >{`Retailer actions ${
            item.retailerStatus ? 'completed' : 'not completed'
          }`}</Text>
        </View>
        {showFullDetails && showFullDetails === true ? (
          <Text
            style={{
              ...baseStyles.textLeftAligned,
              ...baseStyles.textBold,
              marginTop: 5,
              color: Colors.vwgDarkSkyBlue,
            }}
          >
            {item.toolsAffected}
          </Text>
        ) : null}
        {item.retailerStatus &&
        item.retailerStatus.toLowerCase() === 'c' ? null : (
          <Text
            style={
              showFullDetails && showFullDetails === true
                ? { ...baseStyles.textLeftAlignedBold, marginTop: 5 }
                : { ...baseStyles.textLeftAligned }
            }
          >{`You haven't responded yet`}</Text>
        )}
        {showFullDetails && showFullDetails === true ? (
          item.retailerStatus ? null : (
            <Text
              style={{ ...baseStyles.textLeftAligned, marginTop: 5 }}
            >{`Start date: ${getDisplayDate(item.dateCreated)}`}</Text>
          )
        ) : null}
        {item.retailerStatus ? null : (
          <Text
            style={baseStyles.textLeftAligned}
          >{`To be completed by: ${getDisplayDate(item.expiryDate)}`}</Text>
        )}
      </View>
    );
  };

  //   console.log(serviceMeasures && serviceMeasures);

  return (
    <View style={baseStyles.viewDataList}>
      {serviceMeasures && serviceMeasures.length > 0
        ? serviceMeasures.map((item, i) =>
            item.retailerStatus &&
            item.retailerStatus.toLowerCase() === 'c' ? null : (
              <View
                style={
                  i === serviceMeasures.length - 1
                    ? baseStyles.viewDataListItemNoBorder
                    : baseStyles.viewDataListItemWithBorder
                }
                key={i}
              >
                {getFormattedServiceMeasure(item)}
              </View>
            )
          )
        : null}
    </View>
  );
}
