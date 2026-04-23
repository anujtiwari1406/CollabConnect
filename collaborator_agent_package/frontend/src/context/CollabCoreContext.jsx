import React, { createContext, useContext, useState } from 'react';

const CollabCoreContext = createContext();

export const useCollabCore = () => useContext(CollabCoreContext);

export const CollabCoreProvider = ({ children }) => {
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <CollabCoreContext.Provider value={{
            hasUnreadMessages,
            setHasUnreadMessages,
            loading
        }}>
            {children}
        </CollabCoreContext.Provider>
    );
};


