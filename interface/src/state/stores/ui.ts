import { createContext } from "react";
import { action, computed, observable, runInAction } from "mobx";

import { api } from "src/api";
import { IFilter, NetworkStatus } from "src/state/models";
import { isEmpty, validateUpload } from "src/utils";
import { ConfirmationType, ModalType } from "src/state/constants";
import { DatasetsStore, datasetsStoreRaw } from "src/state/stores/datasets";

type IUploadParams = {
  name: string;
  ignored?: boolean;
};

type IUpload = {
  file: File;
  ns: NetworkStatus;
  errors: string[];
} & IUploadParams;

export class UIStore {
  @observable title: string | null = null;
  @observable modal: { type: ModalType } | null = null;
  @observable confirmations: Array<{ type: ConfirmationType }> = [];
  @observable shouldOpenFI: boolean = false;
  @observable uploads: IUpload[] | null = null;
  @observable filter: IFilter = { queryId: null, descFilter: null };

  constructor(private datasetStore: DatasetsStore) {}

  @computed get canResumeUpload() {
    return this.uploads !== null && this.uploads.every((upl) => upl.ns !== NetworkStatus.SUCCESS);
  }

  @action popupFileInput(shouldOpen: boolean) {
    if (shouldOpen && this.shouldOpenFI) console.warn("shouldOpenFI already true");
    else if (!shouldOpen && !this.shouldOpenFI) console.warn("shouldOpenFI already false");
    else this.shouldOpenFI = shouldOpen;
  }

  @action setUploads(files: File[] | null) {
    if (files === null || files.length === 0) {
      this.uploads = null;
    } else {
      this.uploads = files.map((file) => ({
        file: file,
        ns: NetworkStatus.UNSENT,
        name: "",
        errors: []
      }));
    }
  }

  @action showModal(modalType: ModalType) {
    if (this.modal !== null) {
      console.error(
        `"${this.modal.type}" already visible. Can not show multiple modals: "${modalType}"`
      );
    } else {
      this.modal = { type: modalType };
    }
  }

  @action hideModal(modalType?: ModalType) {
    if (modalType && this.modal && this.modal.type !== modalType) {
      console.warn(`Can not hide modal that is not visible. ${modalType}`);
    } else {
      this.modal = null;
    }
  }

  @action showConfirmation(type: ConfirmationType) {
    this.confirmations.push({ type });
  }

  @action hideConfirmation() {
    const [popped, ...rest] = this.confirmations;
    this.confirmations = rest;
  }

  @action modifyUpload(i: number, params: Partial<IUploadParams>) {
    if (this.uploads === null) {
      console.error("UIStore.uploads === null -> modifyUpload not possible");
    } else {
      // DO NOT use this in a reactive context.
      const upload = this.uploads[i];
      if (isEmpty(upload)) {
        console.error("Invalid index passed to UIStore.modifyUpload. Ignoring.");
      } else {
        this.uploads[i] = {
          ...upload,
          ...params
        };
      }
    }
  }

  @action submitUpload(i: number) {
    if (this.uploads === null || isEmpty(this.uploads[i])) {
      console.error("submitUpload: Not a valid upload.");
    } else {
      const upload = this.uploads[i];

      if (
        upload.ns === NetworkStatus.REQUEST ||
        (upload.ns === NetworkStatus.FAILURE && upload.errors.length > 0) ||
        upload.ns === NetworkStatus.SUCCESS
      ) {
        console.warn(
          "Trying to upload file that was already sent, or hasn't been modified since errors were thrown"
        );
      } else {
        const errors = validateUpload(upload);
        if (errors.length > 0) {
          upload.ns = NetworkStatus.FAILURE;
          upload.errors = errors;
          return;
        }

        if (i === this.uploads.length - 1) {
          this.hideModal(ModalType.UPLOAD_MANAGER);
        }

        api
          .submitUpload(upload)
          .then((response) => {
            if (response.errors.length > 0 || response.dataset === null) {
              console.error("fetchDatasets: Recieved errors");

              runInAction("submitUploadFailure", () => {
                upload.ns = NetworkStatus.FAILURE;
                upload.errors = response.errors;
              });
            } else {
              runInAction("submitUploadSuccess", () => {
                upload.ns = NetworkStatus.SUCCESS;
                if (response.dataset === null) {
                  console.error("Recieved null dataset on submit upload with no errors...");
                  upload.errors = ["null_dataset"];
                } else {
                  this.datasetStore.setDataset(response.dataset);
                  upload.errors = [];
                }
              });
            }
          })
          .catch((error) => {
            console.error("submitUploadCatch: caught");
            console.error(error);

            runInAction("submitUploadCatch", () => {
              upload.ns = NetworkStatus.FAILURE;
              upload.errors = ["caught_error"];
            });
          });
      }
    }
  }

  @action updateFilter(filter: Partial<IFilter>) {
    // prettier-ignore
    if (filter === {}) { filter.descFilter = null; filter.queryId = null }
    if (filter.descFilter === "") filter.descFilter = null;
    if (filter.queryId === "") filter.queryId = null;

    this.filter = {
      ...this.filter,
      ...filter
    };
  }
}

export const uiStoreRaw = new UIStore(datasetsStoreRaw);
export const UIContext = createContext(uiStoreRaw);
