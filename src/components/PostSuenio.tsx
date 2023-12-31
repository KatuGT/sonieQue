import {
  Button,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import ClearIcon from "@mui/icons-material/Clear";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadImages } from "@/utils/uploadImages";
import CheckboxTag from "./CheckboxTag";
import { filtros } from "@/utils/filtros";

interface PostSuenioProps {
  texto: string;
  imagenes: any;
  tags: string[];
}

const PostSuenio = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [cantidadImgExcedida, setCantidadImgExcedida] = useState(false);

  const [tamanioIncorrecto, setTamanioIncorrecto] = useState(false);

  const [archivosParaSubir, setArchivosParaSubir] = useState<any>();

  const handleChosenImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e?.target?.files;

    const minPX = 500;
    const maxPX = 1200;

    if ((files && files?.length >= 4) || imagePreview.length >= 3) {
      setCantidadImgExcedida(true);
    } else if (files && files?.length <= 3) {
      setCantidadImgExcedida(false);

      const filesArray = Array.from(files);

      for (const file of filesArray) {
        const img = new (window as any).Image();
        img.src = URL.createObjectURL(file);

        img.onload = function () {
          const width = img.width;
          const height = img.height;

          if (
            ((width >= minPX || height >= minPX) && width <= maxPX) ||
            height <= maxPX
          ) {
            setImagePreview((prevImages) => [...prevImages, img.src]);
            setTamanioIncorrecto(false);
            setArchivosParaSubir(files);
          } else {
            setTamanioIncorrecto(true);
          }
        };
      }
    }
  };

  const postSueniosSchema = z.object({
    texto: z
      .string()
      .min(20, "Muy corto, contanos algo interesante")
      .max(1200, "Muy largooo, máximo 1200 caracteres"),
    imagenes: z.any(),
    tags: z.array(z.string()),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<PostSuenioProps>({
    resolver: zodResolver(postSueniosSchema),
    defaultValues: {
      texto: "",
      imagenes: null,
      tags: [],
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ texto: "", imagenes: null, tags: [] });
      setImagePreview([]);
      setArchivosParaSubir(null);
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitLogin = async (data: PostSuenioProps) => {
    const { texto, tags } = data;
    console.log(tags);
    console.log(texto);

    try {
      if (archivosParaSubir) {
        // const imageURLs = await uploadImages(archivosParaSubir);
        console.log(archivosParaSubir);
        setTamanioIncorrecto(false);
        setCantidadImgExcedida(false);
      }
    } catch (error) {
      console.log(error);      
    }
    reset({ imagenes: null, texto: "", tags: [] })
  };

  const resetForm = () => {
    reset({ imagenes: null, texto: "", tags: [] }), setImagePreview([]);
    setArchivosParaSubir([]);
  };

  return (
    <>
      <Button onPress={onOpen}>Contanos que soñaste</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ¿Qué soñaste?
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(onSubmitLogin)}
                  className="flex flex-col  gap-2"
                >
                  <Controller
                    control={control}
                    name="texto"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Textarea
                        ref={ref}
                        variant="faded"
                        placeholder="Soñé que..."
                        className="col-span-12 md:col-span-6 h-full textAreaPostSuenio"
                        minRows={4}
                        maxRows={8}
                        color="secondary"
                        isInvalid={!!errors.texto}
                        isRequired={true}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />

                  {errors.texto && (
                    <p className="text-xs text-danger-300">
                      {errors.texto.message}
                    </p>
                  )}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">
                        Imagenes opcionales*
                      </span>
                      <label htmlFor="botonImagen" className="cursor-pointer">
                        <Button
                          startContent={<AddAPhotoIcon />}
                          variant="ghost"
                          className="self-start"
                          color="success"
                          style={{ pointerEvents: "none", cursor: "pointer" }}
                          isDisabled={imagePreview.length === 3}
                        >
                          Agregar imagen
                        </Button>
                      </label>

                      <Controller
                        control={control}
                        name="imagenes"
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <input
                            className="appearance-none hidden"
                            ref={ref}
                            id="botonImagen"
                            type="file"
                            accept="image/*"
                            multiple
                            capture
                            onChange={(e) => {
                              onChange(e);
                              handleChosenImagen(e);
                            }}
                            onBlur={onBlur}
                          />
                        )}
                      />

                      <p
                        className={`text-xs text-gray-500 ${
                          cantidadImgExcedida && "text-red-500"
                        }`}
                      >
                        - Máximo 3 imagenes
                      </p>
                      <p
                        className={`text-xs text-gray-500 ${
                          tamanioIncorrecto && "text-red-500"
                        }`}
                      >
                        - 500px mínimo, 1200px máximo
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {imagePreview &&
                        imagePreview.map((imageUrl, index) => (
                          <figure
                            key={index}
                            className="relative cursor-pointer overflow-hidden h-16  w-16 rounded-lg"
                          >
                            <NextImage
                              fill={true}
                              objectFit="cover"
                              src={imageUrl}
                              alt="Vista previa de imagenes seleccionadas"
                              className="cursor-pointer bg-slate-50"
                            />
                            <div
                              className="absolute h-full w-full bg-gray-600/30 inset-0 z-10 opacity-0 hover:opacity-100 overflow-hidden flex justify-center items-center text-superDarkBlue text-xl"
                              onClick={() =>
                                setImagePreview((prev) =>
                                  prev.filter((img) => img !== imageUrl)
                                )
                              }
                            >
                              <ClearIcon className="text-4xl" />
                            </div>
                          </figure>
                        ))}
                    </div>
                    <CheckboxGroup
                      label="Select cities"
                      orientation="horizontal"
                      color="secondary"
                      defaultValue={["buenos-aires", "san-francisco"]}
                    >
                      {filtros.map((tag, index) => {
                        return (
                          <Controller
                            key={index}
                            control={control}
                            name="tags"
                            render={(field) => (
                              <CheckboxTag
                                {...field}
                                key={index}
                                color={tag.color}
                                texto={tag.key}
                              />
                            )}
                          />
                        );
                      })}
                    </CheckboxGroup>
                  </div>
                  <Button color="secondary" variant="light" type="submit">
                    Enviar
                  </Button>
                  <Button color="warning" variant="light" onClick={resetForm}>
                    Borrar
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostSuenio;
