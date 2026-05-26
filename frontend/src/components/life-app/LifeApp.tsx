'use client';
import { useEffect } from 'react';
import './life-app.css';
import { AppProvider, useApp } from './context';
import { IOSDevice } from './IOSFrame';
import { TabBar, StatusSpacer } from './primitives';
import { Onboarding } from './onboarding';
import { HomeScreen, BoardScreen, ShopScreen, ServicesScreen, ProductivityScreen, CirclesScreen, AlbumScreen } from './screens';
import {
  ChatSheet, ChatThreadScreen, SearchSheet, NotificationsSheet, ProfileSheet,
  RewardsSheet, PaySheet, SignSheet, TwoFASheet, AccessLogSheet,
  EventDetailScreen, CircleDetailScreen, PersonalInfoScreen,
  MyPeopleScreen, SubscriptionsScreen, FinanceScreen, SharehouseScreen,
} from './sheets';

function Shell() {
  const app = useApp();

  let Screen = HomeScreen;
  if (app.tab === 'board')        Screen = BoardScreen;
  if (app.tab === 'shop')         Screen = ShopScreen;
  if (app.tab === 'services')     Screen = ServicesScreen;
  if (app.tab === 'productivity') Screen = ProductivityScreen;
  if (app.tab === 'circles')      Screen = CirclesScreen;
  if (app.tab === 'album')        Screen = AlbumScreen;

  const top = app.stack[app.stack.length - 1];
  const sheet = app.sheet;

  return (
    <>
      <div className="scroll" data-screen-label={`tab-${app.tab}`}>
        <StatusSpacer/>
        <Screen/>
      </div>
      <TabBar/>

      {app.stack.length > 0 && top && (
        <div className="push-stack">
          {top.kind === 'event-detail'  && <EventDetailScreen  {...(top.props as Record<string, string>)}/>}
          {top.kind === 'circle-detail' && <CircleDetailScreen {...(top.props as Parameters<typeof CircleDetailScreen>[0])}/>}
          {top.kind === 'personal-info' && <PersonalInfoScreen/>}
          {top.kind === 'chat-thread'   && <ChatThreadScreen   {...(top.props as Parameters<typeof ChatThreadScreen>[0])}/>}
          {top.kind === 'my-people'     && <MyPeopleScreen/>}
          {top.kind === 'subscriptions' && <SubscriptionsScreen/>}
          {top.kind === 'finance'       && <FinanceScreen/>}
          {top.kind === 'sharehouse'    && <SharehouseScreen/>}
        </div>
      )}

      {sheet && sheet.kind === 'chat'          && <ChatSheet/>}
      {sheet && sheet.kind === 'search'        && <SearchSheet/>}
      {sheet && sheet.kind === 'notifications' && <NotificationsSheet/>}
      {sheet && sheet.kind === 'profile'       && <ProfileSheet/>}
      {sheet && sheet.kind === 'rewards'       && <RewardsSheet/>}
      {sheet && sheet.kind === 'pay'           && <PaySheet {...(sheet.props as Parameters<typeof PaySheet>[0])}/>}
      {sheet && sheet.kind === 'sign'          && <SignSheet {...(sheet.props as Parameters<typeof SignSheet>[0])}/>}
      {sheet && sheet.kind === '2fa'           && <TwoFASheet {...(sheet.props as Parameters<typeof TwoFASheet>[0])}/>}
      {sheet && sheet.kind === 'access-log'    && <AccessLogSheet/>}
    </>
  );
}

function Mount({ accentHue }: { accentHue?: number }) {
  const app = useApp();
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-hue', String(accentHue ?? 265));
  }, [accentHue]);

  return (
    <div className="ios-screen" data-theme="light" style={{ width: '100%', height: '100%' }}>
      {app.onboarded ? <Shell/> : <Onboarding/>}
    </div>
  );
}

export function LifeApp() {
  return (
    <div className="page">
      <IOSDevice width={402} height={874}>
        <AppProvider>
          <Mount/>
        </AppProvider>
      </IOSDevice>
    </div>
  );
}
