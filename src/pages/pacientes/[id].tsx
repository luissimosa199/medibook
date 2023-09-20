import dbConnect from '@/db/dbConnect'
import { PatientModel } from '@/db/models'
import { useRouter } from 'next/router'
import escapeStringRegexp from 'escape-string-regexp';
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { GetServerSidePropsContext } from 'next';
import UserPhotos from '@/components/UserPhotos';
import { faArrowLeft, faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Image from 'next/image';
import PhotoInput from '@/components/PhotoInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleFileAdding, uploadImages } from '@/utils/formHelpers';
import PrimaryForm from '@/components/PrimaryForm';
import PatientTimelines from '@/components/PatientTimelines';
import ProfilePicture from '@/components/ProfilePicture';

interface PatientePageProps {
    patientData?: {
        name: string;
        email: string;
        tlf: string;
        details: string;
        image: string;
    }
}

const Patient: FunctionComponent<PatientePageProps> = ({ patientData }) => {

    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [newImages, setNewImages] = useState<string[]>([])
    const [imageUploadPromise, setImageUploadPromise] = useState<Promise<any> | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [addNewTimeline, setAddNewTimeline] = useState<boolean>(false)

    const queryClient = useQueryClient();

    const uploadPhotosMutation = useMutation((photos: string[]) => uploadUserPhotos(photos, patientData?.email as string), {
        onMutate: (newPhotos: string[]) => {

            const previousData = queryClient.getQueryData<string[]>(['patientPhotos', patientData?.email ]);

            queryClient.setQueryData<string[]>(['patientPhotos', patientData?.email ], (oldData = []) => {
                return [...oldData, ...newPhotos];
            });

            return { previousData };
        },
        onSuccess: () => {
            setNewImages([]);
            setUploadedImages([]);
            setImageUploadPromise(null)
        },
        onError: (_: any, __: any, context: any) => {
            queryClient.setQueryData(['patientPhotos', patientData?.email], context.previousData);
        }
    });

    const uploadUserPhotos = async (photos: string[], userEmail: string) => {
        const response = await fetch(`/api/pacientes/photos/?username=${encodeURIComponent(userEmail)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photos })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Something went wrong');
        }

        return response.json();
    };

    const handleChangeAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation()

        queryClient.cancelQueries([patientData?.email, 'profilePicture'])
        try {
            const file = event.target.files?.[0]
            if (!file) return;

            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result as string);
                };
                reader.onerror = function () {
                    reject(new Error("Failed to read the file"));
                };
                reader.readAsDataURL(file);
            });
            queryClient.setQueryData([patientData?.email, 'profilePicture'], { image: dataUrl });
            const avatarArr = await uploadImages(event);
            const avatarUrl = avatarArr![0];

            const response = await fetch(`/api/pacientes/avatar/?username=${encodeURIComponent(patientData?.email as string)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: avatarUrl })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || `Server responded with ${response.status}`);
            }

            return

        } catch (error) {
            console.error("Error updating avatar:", error);
        }
    };

    const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        await handleFileAdding(event, setNewImages);

        setIsUploading(true);

        try {
            const urls = await uploadImages(event) as string[];
            setImageUploadPromise(Promise.resolve(urls));
            setUploadedImages(prevUrls => [...prevUrls, ...urls]);
        } catch (error) {
            console.error("Error uploading images:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        queryClient.cancelQueries(['patientPhotos', patientData?.email])

        const uploadedUrls = await imageUploadPromise;
        if (uploadedUrls && uploadedUrls.length) {
            uploadPhotosMutation.mutate(uploadedUrls);
        }
    };

    const handleDeleteImage = (index: number) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const newUploadedImages = uploadedImages.filter((_, photoIndex) => photoIndex !== index);
        setUploadedImages(newUploadedImages);
        const updatedNewImages = newImages.filter((_, imgIndex) => imgIndex !== index);
        setNewImages(updatedNewImages);
    };

    return (
        <div className="p-8 bg-gray-50 space-y-12">
            <div className="flex gap-2 items-center">
                <Link href="/pacientes" className="w-4 h-4">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <h1 className="text-4xl font-bold text-gray-800 border-b-2 pb-3">{patientData?.name}</h1>
            </div>
            <div className="flex flex-col justify-around items-center border rounded-lg p-6 bg-white shadow-lg">
                <div className="flex flex-col items-center relative">
                    <ProfilePicture username={patientData?.email as string} />
                    <div className="border-2 absolute bottom-0 left-0 bg-white h-12 w-12 rounded-full overflow-hidden flex justify-center">
                        <PhotoInput handleUploadImages={handleChangeAvatar} variant="small" id="profilepicture" />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl mt-2 font-semibold text-gray-800 border-b-2 pb-3">Fotos:</h2>
                    <UserPhotos username={patientData?.email as string} queryKey={['patientPhotos', patientData?.email as string]} />
                    <div className="w-24 mx-auto">
                        <PhotoInput handleUploadImages={handleUploadImages} id="patientphotos" variant="small" />
                    </div>
                    <div className="mt-4 space-y-4">
                        {newImages && newImages.map((e: string, index: number) => {
                            const isVideo = e.includes("data:video/mp4");
                            return (
                                <div key={index} className="flex items-center gap-2 bg-gray-100 p-4 rounded-md">
                                    <button
                                        onClick={handleDeleteImage(index)}
                                        className="bg-red-500 text-white p-2 w-8 h-8 rounded-full hover:bg-red-600 flex justify-center items-center transition duration-300"
                                    >
                                        <FontAwesomeIcon className="w-8" icon={faX} />
                                    </button>
                                    {isVideo ? <video
                                        controls
                                        width="200"
                                        height="200"
                                        className="rounded mx-auto"
                                    >
                                        <source src={e} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video> : <Image src={e} alt="" width={200} height={200} />}
                                </div>
                            )
                        })}
                    </div>
                    {newImages.length > 0 && <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        {isUploading ? 'Subiendo...' : 'Subir'}
                    </button>}
                </div>


                <div className="w-full">
                    <div className="mt-2 border-b-2 pb-3">
                        <div className="flex justify-between">
                            <h2 className="text-2xl font-semibold text-gray-800 ">
                                Historias:
                            </h2>
                            <button className={`border-2 w-10 rounded p-2 ${addNewTimeline ? "bg-gray-200" : "bg-white"} text-slate-600 transition`} onClick={(e) => { e.preventDefault(); setAddNewTimeline(!addNewTimeline) }}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                        {addNewTimeline && <PrimaryForm patientData={{ pacientId: patientData?.email as string, pacientName: patientData?.name as string }} />}
                    </div>
                    <div>
                        <PatientTimelines username={patientData?.email as string} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Patient

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    try {
        await dbConnect();

        const { id } = context.query;
        const safeId = escapeStringRegexp(id as string);

        const patient = await PatientModel.findOne({ email: new RegExp("^" + safeId) }).select("name email tlf details image").lean();

        if (patient) {
            const patientData = {
                name: patient.name,
                email: patient.email,
                tlf: patient.tlf,
                details: patient.details,
                image: patient.image || "",
                photos: patient.photos || [],
            }
            return {
                props: {
                    patientData,
                },
            };
        }

        throw new Error('error')

    } catch (error) {
        console.error(error);
        return {
            notFound: true,
        };
    }
}