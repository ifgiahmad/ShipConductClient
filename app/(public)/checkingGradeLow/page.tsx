"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getVesselCrew } from "@/services/service_api_viewCrewingForCrew";

const formSchema = z.object({
  idPelaut: z.string().min(1, {
    message: "Id Pelaut is required",
  }),
  ktp: z.string().min(1, {
    message: "KTP is required",
  }),
});

const CheckingGradeForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idPelaut: "",
      ktp: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const cek = await getVesselCrew(data.idPelaut, data.ktp);
      console.log(cek);
      if (cek) {
        /*  router.push(
          `/assessmentGradeLow?idPelaut=${data.idPelaut}&ktp=${data.ktp}`
        ); */
        router.push(`assessmentGradeLow/${data.idPelaut}/${data.ktp}`);
      } else {
        toast.error("Id Pelaut Dan Nomor KTP Anda Tidak Terdaftar");
      }
    } catch (error) {
      toast.error("Fetch Data Failed");
      console.error("Fetch Data Failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checking</CardTitle>
        <CardDescription>Masukan Id Pelaut Dan Nomor KTP Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="idPelaut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Id Pelaut
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible: ring-offset-0"
                      placeholder="Masukan Id Pelaut"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ktp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    KTP
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="ktp"
                      className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible: ring-offset-0"
                      placeholder="Masukan KTP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-green-800 hover:bg-green-400"
              disabled={loading}
            >
              {loading ? "Checking..." : "Check"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CheckingGradeForm;
