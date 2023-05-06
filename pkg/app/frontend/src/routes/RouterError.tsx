import { BugAntIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function RouterError() {
    const error = useRouteError();
    console.error(error);

    let errorText: string;

    if (isRouteErrorResponse(error)) {
        errorText = error.statusText;
    } else {
        errorText = error.message || 'Unknown error';
    }

    return (
        <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-zinc-800">
            <div className="flex flex-col rounded-lg border-2 border-black bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 text-zinc-100 md:flex-row">
                <div className="flex items-center justify-center p-4">
                    <BugAntIcon className="h-20 w-20" />
                </div>
                <div className="flex flex-col justify-between">
                    <div className="flex flex-none flex-col items-center justify-center p-4 font-black">
                        Achievement Unlocked!
                        <br />
                        <i className="font-normal">Found a bug</i>
                    </div>
                    <div className="p-2">
                        You found a bug - click{' '}
                        <Link to="/" className="text-amber-300">
                            here
                        </Link>{' '}
                        to go home.
                        <br />
                        Error message:{' '}
                        <span className="rounded-md bg-gray-800 bg-opacity-50 p-0.5 font-mono">{errorText}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
