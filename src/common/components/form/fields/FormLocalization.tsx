import MapAdapter from '@/Common/lib/maps/MapAdapter';
import { GOOGLE_MAPS_API_KEY } from '@/Common/settings';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import PinIcon from '@/Items/assets/icons/pin.svg?react';
import MapSearchAdapter from '@/Common/lib/maps/MapSearchAdapter';
import type { FullAddress } from '@/Common/types';
import type { FormApi } from '@tanstack/react-form';
import type { FormValues } from '@/Items/components/ItemForm';

interface ComponentProps {
    className?: string;
    form: FormApi<FormValues>;
    initialLatitude?: number | null;
    initialLongitude?: number | null;
    initialLocation?: string;
}

const FormLocalization = ({ className, form, initialLatitude, initialLongitude, initialLocation }: ComponentProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [mapSearch, setMapSearch] = useState<any>(null);

    // Set initial location in the input field
    useEffect(() => {
        if (inputRef.current && initialLocation) {
            inputRef.current.value = initialLocation;
        }
    }, [initialLocation]);

    const initMap = async () => {
        const googleMaps = new MapAdapter(GOOGLE_MAPS_API_KEY as string);

        await googleMaps.init(mapRef.current);

        return googleMaps;
    };

    const changeMapLocation = (location: Pick<FullAddress, 'lat' | 'lng' | 'address'>) => {
        form.setFieldValue('latitude', location.lat);
        form.setFieldValue('longitude', location.lng);
        form.setFieldValue('location', location.address);
    };

    useEffect(() => {
        let mapInstance: MapAdapter | null = null;

        (async () => {
            mapInstance = await initMap();

            if (mapInstance) {
                if (initialLatitude && initialLongitude) {
                    const initialPosition = {
                        lat: initialLatitude,
                        lng: initialLongitude,
                    };
                    mapInstance.setLocation(initialPosition);
                    changeMapLocation({
                        lat: initialLatitude,
                        lng: initialLongitude,
                        address: initialLocation || '',
                    });
                }

                if (inputRef.current) {
                    const mapSearch = new MapSearchAdapter(mapInstance, inputRef.current);
                    mapSearch.init();

                    mapSearch.onPlaceChanged = (location) => {
                        if (location) {
                            mapInstance!.hasLocation = true;

                            changeMapLocation(location);

                            mapInstance?.setLocation(location);

                            mapInstance?.mapInstance?.panTo(location);
                            mapInstance?.mapInstance?.setZoom(16);
                        } else {
                            mapInstance!.hasLocation = false;
                        }
                    };

                    setMapSearch(mapSearch);
                }
            }
        })();

        return () => {
            mapInstance?.dispose();
            mapSearch?.cleanUp();
        };
    }, [initialLatitude, initialLongitude, initialLocation]);

    return (
        <>
            <div>
                <div className="flex flex-col relative">
                    <input
                        ref={inputRef}
                        type="text"
                        className="pl-10 bg-gray-100 h-12 px-3 flex items-center  border rounded-xl border-none focus:outline-none"
                    />
                    <div className="absolute left-4 text-green-500 top-1/2 -translate-y-1/2">
                        <PinIcon className="size-4" />
                    </div>
                </div>
            </div>

            <div ref={mapRef} className={clsx('w-full aspect-[5/2] rounded-xl mt-4', className)}></div>
        </>
    );
};

export default FormLocalization;
