"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useHasMounted = () =>
	useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
